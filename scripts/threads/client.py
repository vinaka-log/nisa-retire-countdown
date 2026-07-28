"""Meta Threads Graph API client (text posts).

Simplified from keiba-ev-app/backend/app/services/threads_client.py
"""

from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass, field
from typing import List, Optional

import httpx

# Meta / network transient failures (GitHub Actions 朝枠で code:2 が出た実績あり)
_RETRYABLE_HTTP = frozenset({429, 500, 502, 503, 504})
_RETRYABLE_FB_CODES = frozenset({1, 2, 4, 17, 32})
_MAX_ATTEMPTS = 4
_BACKOFF_SEC = (2.0, 5.0, 10.0)


class ThreadsApiError(RuntimeError):
    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        payload: Optional[dict] = None,
    ):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload or {}


@dataclass
class ThreadsPostResult:
    texts: List[str]
    post_ids: List[str]
    dry_run: bool
    image_urls: List[str] = field(default_factory=list)


class ThreadsClient:
    def __init__(
        self,
        access_token: str,
        user_id: str,
        *,
        api_base: str = "https://graph.threads.net/v1.0",
        publish_delay_sec: float = 2.0,
        timeout_sec: float = 30.0,
    ) -> None:
        if not access_token:
            raise ValueError("THREADS_ACCESS_TOKEN が未設定です")
        if not user_id:
            raise ValueError("THREADS_USER_ID が未設定です")
        self.access_token = access_token
        self.user_id = user_id
        self.api_base = api_base.rstrip("/")
        self.publish_delay_sec = max(0.0, publish_delay_sec)
        self.timeout_sec = timeout_sec

    @staticmethod
    def _error_payload(payload: Optional[dict]) -> dict:
        if not isinstance(payload, dict):
            return {}
        err = payload.get("error")
        return err if isinstance(err, dict) else {}

    @classmethod
    def _is_retryable(cls, exc: ThreadsApiError) -> bool:
        if exc.status_code in _RETRYABLE_HTTP:
            return True
        err = cls._error_payload(exc.payload)
        if err.get("is_transient"):
            return True
        code = err.get("code")
        return isinstance(code, int) and code in _RETRYABLE_FB_CODES

    async def _post_params(
        self,
        path: str,
        params: dict,
        *,
        client: Optional[httpx.AsyncClient] = None,
    ) -> dict:
        last_exc: Optional[ThreadsApiError] = None
        for attempt in range(_MAX_ATTEMPTS):
            try:
                return await self._post_params_once(path, params, client=client)
            except ThreadsApiError as exc:
                last_exc = exc
                if attempt >= _MAX_ATTEMPTS - 1 or not self._is_retryable(exc):
                    raise
                delay = _BACKOFF_SEC[min(attempt, len(_BACKOFF_SEC) - 1)]
                await asyncio.sleep(delay)
        raise last_exc or ThreadsApiError(f"API失敗 {path}")

    async def _post_params_once(
        self,
        path: str,
        params: dict,
        *,
        client: Optional[httpx.AsyncClient] = None,
    ) -> dict:
        own_client = client is None
        http = client or httpx.AsyncClient(timeout=self.timeout_sec)
        try:
            response = await http.post(f"{self.api_base}/{path}", params=params)
            data = response.json() if response.content else {}
            if response.status_code >= 400 or "id" not in data:
                raise ThreadsApiError(
                    f"API失敗 {path}: {data}",
                    status_code=response.status_code,
                    payload=data if isinstance(data, dict) else {},
                )
            return data if isinstance(data, dict) else {}
        finally:
            if own_client:
                await http.aclose()

    async def create_media_container(
        self,
        text: str,
        *,
        reply_to_id: Optional[str] = None,
        topic_tag: Optional[str] = None,
        client: Optional[httpx.AsyncClient] = None,
    ) -> str:
        params: dict = {
            "text": text,
            "access_token": self.access_token,
            "media_type": "TEXT",
        }
        if reply_to_id:
            params["reply_to_id"] = reply_to_id
        if topic_tag:
            params["topic_tag"] = topic_tag.lstrip("#")

        data = await self._post_params(f"{self.user_id}/threads", params, client=client)
        return str(data["id"])

    async def publish_container(
        self,
        creation_id: str,
        *,
        client: Optional[httpx.AsyncClient] = None,
    ) -> str:
        data = await self._post_params(
            f"{self.user_id}/threads_publish",
            {
                "creation_id": creation_id,
                "access_token": self.access_token,
            },
            client=client,
        )
        return str(data["id"])

    async def publish_item(
        self,
        text: str,
        *,
        reply_to_id: Optional[str] = None,
        topic_tag: Optional[str] = None,
        client: Optional[httpx.AsyncClient] = None,
    ) -> str:
        creation_id = await self.create_media_container(
            text,
            reply_to_id=reply_to_id,
            topic_tag=topic_tag,
            client=client,
        )
        if self.publish_delay_sec:
            await asyncio.sleep(self.publish_delay_sec)
        return await self.publish_container(creation_id, client=client)

    async def publish_thread(
        self,
        texts: List[str],
        *,
        topic_tag: Optional[str] = None,
        dry_run: bool = False,
    ) -> ThreadsPostResult:
        cleaned = [t.strip() for t in texts if t and t.strip()]
        if not cleaned:
            raise ValueError("投稿コンテンツが空です")

        if dry_run:
            return ThreadsPostResult(texts=cleaned, post_ids=[], dry_run=True)

        post_ids: List[str] = []
        async with httpx.AsyncClient(timeout=self.timeout_sec) as http:
            reply_to: Optional[str] = None
            for index, text in enumerate(cleaned):
                post_id = await self.publish_item(
                    text,
                    reply_to_id=reply_to,
                    topic_tag=topic_tag if index == 0 else None,
                    client=http,
                )
                post_ids.append(post_id)
                reply_to = post_id

        return ThreadsPostResult(texts=cleaned, post_ids=post_ids, dry_run=False)

""" event_info route """

import logging
from datetime import datetime

import asyncpg
from app.lru_cache_with_expiry import lru_cache_with_expiry
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)


class EventRegistrationResponse(BaseModel):
    """Event Info Response"""

    event_id: str
    event_code: str
    event_url: str
    event_url_text: str
    event_image_url: str | None = None
    organizer_name: str
    organizer_email: str
    event_markdown: str
    start_utc: datetime
    end_utc: datetime

    def __init__(
        self,
        event_id: str,
        event_code: str,
        event_url: str,
        event_url_text: str,
        event_image_url: str | None,
        organizer_name: str,
        organizer_email: str,
        event_markdown: str,
        start_utc: datetime,
        end_utc: datetime,
    ) -> None:
        super().__init__(
            event_id=event_id,
            event_code=event_code,
            event_url=event_url,
            event_url_text=event_url_text,
            event_image_url=event_image_url,
            organizer_name=organizer_name,
            organizer_email=organizer_email,
            event_markdown=event_markdown,
            start_utc=start_utc,
            end_utc=end_utc,
        )


class EventRegistrationInfo:
    """Completion route"""

    def __init__(self, db_manager):
        self.db_manager = db_manager
        self.logger = logging.getLogger(__name__)
        self.router = APIRouter()  # Add this line

    def include_router(self):
        """include router"""

        # This path is used by the playground
        @self.router.get("/event/{event_id}", status_code=200)
        async def event_registration(event_id: str) -> EventRegistrationResponse:
            """get event info for registartion"""

            return await self.get_event_info(event_id)

        return self.router

    @lru_cache_with_expiry(maxsize=20, ttl=180)
    async def get_event_info(self, event_id: str) -> EventRegistrationResponse:
        """get event info"""

        pool = await self.db_manager.get_connection()

        try:
            async with pool.acquire() as conn:
                result = await conn.fetch(
                    "SELECT * FROM aoai.get_event_registration_by_event_id($1)", event_id
                )

            if not result:
                raise HTTPException(
                    status_code=404,
                    detail="Event not found.",
                )

            return EventRegistrationResponse(**result[0])

        except HTTPException:
            raise

        except asyncpg.exceptions.PostgresError as error:
            self.logger.error("Postgres error: %s", str(error))
            raise HTTPException(
                status_code=503,
                detail="Error reading model catalog.",
            ) from error

        except Exception as exp:
            self.logger.error("Postgres exception: %s", str(exp))
            self.logger.error(exp)
            raise HTTPException(
                detail="Error reading model catalog.",
                status_code=503,
            ) from exp

import json
import logging
import re
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client_initialized = False
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.client_initialized = True
                logger.info("Google Gemini API successfully configured.")
            except Exception as e:
                logger.warning(f"Could not configure Google Gemini API: {e}")

    def generate_json_response(self, prompt: str, system_instruction: str = "") -> Optional[Dict[str, Any]]:
        if not self.client_initialized:
            return None

        try:
            model = genai.GenerativeModel(
                model_name=settings.DEFAULT_MODEL,
                generation_config={"response_mime_type": "application/json"}
            )
            full_prompt = f"{system_instruction}\n\nTask:\n{prompt}" if system_instruction else prompt
            response = model.generate_content(full_prompt)
            if response and response.text:
                # Clean response text if code fences are present
                clean_txt = response.text.strip()
                clean_txt = re.sub(r"^```json\s*", "", clean_txt)
                clean_txt = re.sub(r"\s*```$", "", clean_txt)
                return json.loads(clean_txt)
        except Exception as e:
            logger.error(f"Error querying Gemini API: {e}")
            return None
        return None

llm_service = LLMService()

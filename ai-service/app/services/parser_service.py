import io
import re
from pypdf import PdfReader

class ParserService:
    @staticmethod
    def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            text_parts = []
            for page_idx, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
            full_text = "\n".join(text_parts)
            return ParserService.clean_text(full_text)
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
        # Remove repeated whitespaces and null characters
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', ' ', text)
        cleaned = re.sub(r'[ \t]+', ' ', cleaned)
        cleaned = re.sub(r'\n\s*\n', '\n\n', cleaned)
        return cleaned.strip()

parser_service = ParserService()

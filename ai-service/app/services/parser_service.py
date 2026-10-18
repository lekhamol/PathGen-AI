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
                # Use layout extraction mode for better text ordering
                extracted = page.extract_text(extraction_mode="layout")
                if not extracted:
                    # Fallback to plain mode
                    extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
            if not text_parts:
                raise ValueError("No readable text found in PDF. The file may be scanned/image-based or encrypted.")
            full_text = "\n".join(text_parts)
            return ParserService.clean_text(full_text)
        except ValueError:
            raise
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
        # Remove only genuine ASCII control characters (NOT extended Latin / UTF-8 bytes)
        # \x00-\x08: non-printable controls, \x0b\x0c: vertical tab / form feed
        # \x0e-\x1f: other controls. We keep \x09 (tab), \x0a (LF), \x0d (CR)
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', ' ', text)
        # Collapse multiple spaces/tabs into one
        cleaned = re.sub(r'[ \t]+', ' ', cleaned)
        # Collapse multiple blank lines into at most two newlines
        cleaned = re.sub(r'\n\s*\n', '\n\n', cleaned)
        return cleaned.strip()

parser_service = ParserService()

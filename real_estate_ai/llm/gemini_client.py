from google import genai
from google.genai import errors as genai_errors
from config.settings import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"

def generate_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text # pyright: ignore[reportReturnType]
    except genai_errors.ClientError as e:
        # Try to list available models to give a helpful error message
        available = None
        try:
            models = client.models.list()
            available = [m.name for m in models]
        except Exception:
            available = None

        msg = (
            f"Failed to generate with model '{MODEL_NAME}': {e}. "
            "This model may not be available for the current API version or for generate_content. "
            "Update the GEMINI_MODEL environment variable to a supported model."
        )
        if available:
            msg += f" Available models: {available}"

        raise RuntimeError(msg) from e
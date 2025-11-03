"""
Dynamic Prompt List Node
A ComfyUI custom node with dynamic text box count for managing prompt lists.
"""

class DynamicPromptList:
    """
    Dynamic prompt list node with configurable number of text boxes.
    Returns a comma-separated string of all prompts.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "inputcount": ("INT", {"default": 5, "min": 2, "max": 50, "step": 1}),
            },
            "hidden": {
                "prompt_1": "STRING",
                "prompt_2": "STRING",
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "create_prompt_list"
    CATEGORY = "Serhii/Utils"

    DESCRIPTION = """
Creates a comma-separated list from dynamic text boxes.
Set the number of text boxes with the **inputcount** parameter
and click "Update inputs" button to add/remove text boxes.
"""

    def create_prompt_list(self, inputcount, **kwargs):
        """
        Creates a comma-separated string from dynamic text boxes.

        Args:
            inputcount: Number of text boxes
            **kwargs: Dynamic text values (prompt_1, prompt_2, etc.)

        Returns:
            Tuple containing comma-separated string
        """
        prompts = []

        # Collect all text from dynamic boxes
        for i in range(1, inputcount + 1):
            prompt_key = f"prompt_{i}"
            prompt = kwargs.get(prompt_key, "")

            # Add non-empty text
            if prompt and prompt.strip():
                prompts.append(prompt.strip())

        # Return as comma-separated string
        return (",".join(prompts),)


# Node registration
NODE_CLASS_MAPPINGS = {
    "Dynamic Prompt List": DynamicPromptList,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Dynamic Prompt List": "Dynamic Prompt List",
}

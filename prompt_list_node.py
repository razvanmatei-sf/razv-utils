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
        # Generate 10 prompts - reasonable balance between flexibility and UI size
        inputs = {
            "required": {
                "inputcount": ("INT", {"default": 5, "min": 2, "max": 10, "step": 1}),
            },
        }

        # Add 10 prompts to INPUT_TYPES so ComfyUI creates proper text boxes
        for i in range(1, 11):
            inputs["required"][f"prompt_{i}"] = ("STRING", {"multiline": True, "default": ""})

        return inputs

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "create_prompt_list"
    CATEGORY = "Serhii/Utils"

    DESCRIPTION = """
Creates a comma-separated list from text boxes.
Set the number of text boxes to use with the **inputcount** parameter (2-10).
All 10 text boxes are always visible, only the first 'inputcount' boxes will be processed.
"""

    def create_prompt_list(self, inputcount, **kwargs):
        """
        Creates a comma-separated string from text boxes.

        Args:
            inputcount: Number of text boxes to process
            **kwargs: Text values (prompt_1, prompt_2, etc.)

        Returns:
            Tuple containing comma-separated string
        """
        prompts = []

        # Only process the first 'inputcount' prompts
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

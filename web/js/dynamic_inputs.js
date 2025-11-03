/**
 * Dynamic Text Boxes Extension for Dynamic Prompt List Node
 * Manages text box widgets based on inputcount
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "Serhii.DynamicPromptList",

    async nodeCreated(node) {
        if (node.comfyClass !== "Dynamic Prompt List") {
            return;
        }

        // Add Update inputs button after existing widgets
        node.addWidget("button", "Update inputs", null, () => {
            updatePrompts(node);
        });
    }
});

function updatePrompts(node) {
    const inputcountWidget = node.widgets.find(w => w.name === "inputcount");
    if (!inputcountWidget) return;

    const targetCount = inputcountWidget.value;

    // Count current prompt text boxes (exclude inputcount and button)
    const currentPrompts = node.widgets.filter(w =>
        w.name && w.name.startsWith("prompt_") && w.type !== "button"
    );
    const currentCount = currentPrompts.length;

    console.log(`Dynamic Prompt List: Current=${currentCount}, Target=${targetCount}`);

    if (targetCount === currentCount) return;

    // Remove excess widgets
    if (targetCount < currentCount) {
        const toRemove = currentCount - targetCount;
        for (let i = 0; i < toRemove; i++) {
            const promptWidgets = node.widgets.filter(w =>
                w.name && w.name.startsWith("prompt_") && w.type !== "button"
            );
            if (promptWidgets.length > 0) {
                const lastWidget = promptWidgets[promptWidgets.length - 1];
                const index = node.widgets.indexOf(lastWidget);
                if (index > -1) {
                    node.widgets.splice(index, 1);
                }
            }
        }
    }
    // Add new widgets
    else {
        // Find the button widget position to insert before it
        const buttonIndex = node.widgets.findIndex(w => w.type === "button");

        for (let i = currentCount + 1; i <= targetCount; i++) {
            // Add text widget with multiline support
            const widget = node.addWidget(
                "text",
                `prompt_${i}`,
                "",
                () => {},
                {
                    multiline: true,
                    serialize: true
                }
            );

            // Move widget before the button if button exists
            if (buttonIndex > -1 && widget) {
                const currentIndex = node.widgets.indexOf(widget);
                if (currentIndex !== -1 && currentIndex > buttonIndex) {
                    // Remove from current position
                    node.widgets.splice(currentIndex, 1);
                    // Insert before button
                    node.widgets.splice(buttonIndex, 0, widget);
                }
            }
        }
    }

    // Resize node to fit all widgets
    const newSize = node.computeSize();
    node.setSize(newSize);
    node.setDirtyCanvas(true, true);
}

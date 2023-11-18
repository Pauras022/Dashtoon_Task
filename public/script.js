// public/script.js
document
  .getElementById("comicForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const textInput = document.getElementById("textInput").value;
    if (!textInput) {
      alert("Please enter text for 10 comic panels.");
      return;
    }

    const generateButton = document.getElementById("generateButton");
    const progressElement = document.getElementById("progress");
    const comicDisplay = document.getElementById("comicDisplay");
    const loadingIcon = document.getElementById("loadingIcon");
    comicDisplay.innerHTML = ""; // Clear previous results

    try {
      if (
        !generateButton ||
        !progressElement ||
        !comicDisplay ||
        !loadingIcon
      ) {
        console.error("Some elements not found.");
        return;
      }

      // Disable the button and change its appearance
      generateButton.disabled = true;
      generateButton.classList.add("cursor-not-allowed");
      generateButton.textContent = "Generating Comics...";

      // Show progress initially
      progressElement.classList.remove("hidden");
      loadingIcon.classList.remove("hidden");

      const comicPanels = [];
      for (let i = 0; i < 10; i++) {
        const response = await fetch(
          "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
          {
            method: "POST",
            headers: {
              Accept: "image/png",
              Authorization:
                "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: textInput }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const imageData = await response.blob();
        const imageUrl = URL.createObjectURL(imageData);

        // Add image to panel immediately
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.classList.add(
          "rounded-lg",
          "shadow-md",
          "object-cover",
          "h-32",
          "w-32",
          "p-2"
        );
        imageElement.alt = `Comic panel ${i + 1}`;
        comicDisplay.appendChild(imageElement);

        // Update progress
        progressElement.textContent = `Generated ${i + 1} / 10 panels`;
      }

      alert("All panels generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error generating comics. Please try again.");
    } finally {
      // Enable the button and revert its appearance
      if (generateButton) {
        generateButton.disabled = false;
        // Set button text back to "Generate Comics"
        generateButton.textContent = "Generate Comics";
      }

      // Hide progress after completion
      if (progressElement) {
        progressElement.classList.add("hidden");
      }
      if (loadingIcon) {
        loadingIcon.classList.add("hidden");
      }
    }
  });

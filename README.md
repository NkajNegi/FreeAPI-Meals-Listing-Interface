https://nkajnegi.github.io/FreeAPI-Meals-Listing-Interface/

# ImagineFood

A straightforward interface for discovering recipes using data from the FreeAPI meals database. It is designed to be a quick, searchable reference for finding meal ideas and preparation details.

### The Project
ImagineFood provides a clean way to browse a large collection of recipes. Users can search for specific ingredients, explore different cuisines, and view full preparation instructions along with video tutorials where available. The focus is on a distraction-free experience that gets the user to the recipe as quickly as possible.

### Engineering
The application is built as a lightweight, single-page frontend with a focus on local state management and performance.

*   **Data Strategy:** To ensure a smooth browsing experience, the app fetches the entire recipe collection in a single initial request. This eliminates the latency of subsequent API calls while searching or paging.
*   **Randomization:** A Fisher-Yates shuffle is applied to the dataset on every load, ensuring that the user sees a fresh variety of meals instead of the same static list.
*   **Rendering:** The UI is driven by modular JavaScript functions that generate and inject HTML into the DOM. This approach avoids the overhead of a heavy framework while keeping the codebase manageable.
*   **Search Implementation:** The search functionality filters the local dataset in real-time across multiple fields (name, category, area, and instructions), providing immediate feedback without network delays.
*   **UX & Resilience:** The interface handles asynchronous states with skeleton loaders and includes robust error handling. If the API request fails, the app provides a dedicated error UI with a retry mechanism to recover the session.



## Add "Learn More" Button to NASA Modal

This plan adds a button to the NASA detail modal that opens the NASA Image and Video Library website with a search for more images of the same topic.

---

### What Will Change

When viewing a NASA item in the modal, you'll see a new **"Explore More on NASA"** button at the bottom. Clicking it opens a new browser tab with NASA's official image library showing more images related to that topic.

---

### Implementation Details

**File to modify:** `src/components/NasaExplorer.tsx`

#### 1. Add External Link Icon
Import the `ExternalLink` icon from lucide-react to indicate the button opens an external link.

#### 2. Create Search URL Function
Add a helper function to generate the NASA Image Library search URL:
```text
https://images.nasa.gov/search?q={item_title}&media=image
```
The function will encode the item's title to create a proper search query.

#### 3. Add Button to Modal Footer
Place the button in the modal footer (after the category badge section):
- Uses the Button component with a styled appearance
- Includes the ExternalLink icon
- Opens in a new tab with `target="_blank"` and `rel="noopener noreferrer"` for security

---

### Visual Design

The button will:
- Be full-width on mobile, auto-width on desktop
- Use the `pale-nebula` accent color to match the app's theme
- Include an external link icon to indicate it opens a new tab
- Have hover effects consistent with other buttons

---

### Technical Notes

- No API calls needed - this simply constructs a URL and opens it
- The search uses the item's title as the query term
- Uses `encodeURIComponent()` to handle special characters in titles safely


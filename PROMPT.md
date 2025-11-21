# Photo Snake Game - Single Prompt

Create a complete web-based Snake game with photo upload functionality using HTML, CSS, and JavaScript. The game should be deployable to GitHub Pages.

## Requirements:

### Game Features:
1. **Classic Snake Gameplay**: Implement the traditional Nokia Snake game mechanics where the snake moves continuously in a direction and grows when eating food
2. **Photo Integration**: Instead of regular food dots, the snake should eat user-uploaded photographs displayed as circular thumbnails
3. **Controls**: Use arrow keys to control snake direction (up, down, left, right)
4. **Collision Detection**: Game ends when snake hits walls or itself
5. **Scoring System**:
   - Display current score that increases with each photo eaten
   - Track and display high score
   - Persist high score in localStorage
6. **Photo Management**:
   - File upload input accepting multiple images
   - Display thumbnails of uploaded photos
   - Button to clear all photos
   - Store uploaded photos in localStorage so they persist between sessions
7. **Game Controls**:
   - Start/Restart button
   - Pause/Resume button
8. **Instructions**: Display clear how-to-play instructions on the page

### Technical Implementation:

#### HTML Structure (index.html):
- Page title: "Photo Snake Game"
- Upload section with file input (accept multiple images) and clear button
- Photo preview area showing thumbnails
- Game canvas (400x400px)
- Score display showing current score and high score
- Start and Pause buttons
- Instructions section explaining how to play

#### CSS Styling (style.css):
- Modern, attractive design with gradient background
- Centered container with white background and rounded corners
- Styled upload section with light gray background
- Photo thumbnails displayed in a flex grid (60x60px, rounded corners)
- Canvas with black background and border
- Colorful, prominent buttons (green for start, orange for pause, red for clear)
- Responsive design that works on mobile devices
- Professional typography and spacing

#### JavaScript Game Logic (game.js):
- **Grid System**: 20x20 grid on 400x400 canvas
- **Snake**:
  - Array of coordinate objects {x, y}
  - Head colored darker green (#2E7D32), body lighter green (#4CAF50)
  - Starts at center moving right
  - Grows when eating food (doesn't remove tail segment)
- **Food**:
  - Random position on grid
  - Check collision with snake body when placing
  - Display as circular photo thumbnail if photos uploaded, otherwise red circle
  - Randomly select from uploaded photos for each new food
- **Game Loop**: 100ms interval (10 FPS)
- **Collision Detection**:
  - Wall collision: snake head goes outside grid boundaries
  - Self collision: snake head touches any body segment
- **Photo Upload**:
  - Use FileReader to convert images to data URLs
  - Create Image objects and store in array
  - Save/load photo data URLs to/from localStorage
  - Display thumbnails as they're added
- **Storage**:
  - Save high score to localStorage
  - Save uploaded photos as JSON array of data URLs
  - Load both on page initialization
- **Direction Controls**:
  - Prevent reverse direction (can't go down if moving up, etc.)
  - Only allow direction changes when game is running and not paused
  - Prevent default arrow key scrolling

### Visual Design:
- Purple gradient background (from #667eea to #764ba2)
- White game container with box shadow
- Black game canvas
- Green snake with darker head
- Circular food items (photos or red circles)
- Clear visual hierarchy with proper spacing

### User Experience:
- Show "Upload photos and press Start!" message on canvas before game begins
- Show "Game Over!" overlay with final score when game ends
- Change Start button text to "Restart Game" after first start
- Change Pause button text to "Resume" when paused
- Load saved photos and high score on page load
- Smooth, responsive controls

### File Structure:
- index.html (main page)
- style.css (all styling)
- game.js (complete game logic)

All code should be clean, well-organized, and ready to deploy to GitHub Pages without any additional configuration.

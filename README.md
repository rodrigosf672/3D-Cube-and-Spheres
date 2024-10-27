# 3D Cube with Moving Spheres using React Three Fiber

This project is a React-based 3D visualization application, designed to facilitate intuitive 3D exploration. Users can add, move, and interact with spheres within a 3x3x3 grid cube, enhancing spatial understanding in a structured 3D space. The app leverages `@react-three/fiber` and `@react-three/drei` for 3D rendering, making 3D interactions accessible and user-friendly.

## Features

- **Add Spheres**: Add spheres to any position within the 3x3x3 grid.
- **Move Spheres**: Select a sphere and move it using `W`, `A`, `S`, `D`, `Q`, `E`, keys.
- **Sphere Colors**: 
  - **Red**: Currently selected sphere (moving-enabled state).
  - **Blue**: Stationary spheres.
  - **Purple**: Multiple spheres in the same position.
- **Labeling**: Each sphere has a unique identifier (e.g., `C01`, `C02`, etc.) which appears alongside the sphere. Toggle labels on and off using the "Toggle Labels" button.

## Controls

1. **Adding Spheres**: Use the form to add spheres to a position within the grid (x, y, z). Valid values range from 0 to 2.
2. **Selecting Spheres**: Click a sphere to select it (turns red). When multiple spheres are in the same cube position, the one with the lowest index (e.g., `C01`) is selected by default.
3. **Moving Spheres**:
   - **W**: Moves the selected sphere up.
   - **A**: Moves the selected sphere left.
   - **S**: Moves the selected sphere down.
   - **D**: Moves the selected sphere right.
   - **E**: Moves the sphere inward along the z-axis.
   - **Q**: Moves the sphere outward along the z-axis.
4. **Toggle Labels**: Click the "Toggle Labels" button to show/hide labels.

## Known Issues and Limitations
1. If you have too many spheres in the same position, it might become difficult to see the labels, as they might extend too far away. This case is not handled in this implementation.
2. Cnce you click any of the buttons, selected moving (originally red) sphere will be deselected.
3. There is currently no limit to the number of spheres you can add. There may be performance degradation if you have an extremely large number of spheres. I added up to 30 spheres in the cube, and there were no noticeable performance issues.
4. Testing is currently limited to validation that the app does open. It does NOT cover interactivity and responsiveness with the app. I attempted to include mocks for react-three, but it did not work as expected, and testing in the canvas and 3D-interactivity can be extremely challenging. If you have any tips, please let me know! 😊 Or feel free to contribute with your own improvements!

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd 3d-cube-with-moving-spheres
   ```

2. Install dependencies:
   ```bash
   npm install react react-dom @react-three/fiber @react-three/drei three --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

3. Run the app locally:
   ```bash
   npm start
   ```

4. Run test cases (optional, only validates rendering of the app):
   ```bash
   npm test
   ```

## Technologies Used

- **React**: Frontend library for building UI components.
- **@react-three/fiber** and **@react-three/drei**: Libraries for rendering 3D objects and adding interactive elements in React.
- **Jest** and **React Testing Library**: For testing React components.

## Acknowledgements
This project was inspired by reading about the Cube Model in *Huber, F., Jager, B., Erev, I., Cohen, D., Bianchi, S., & Bonfanti, M. (2019). Understanding the crime-terrorism nexus through a dynamic modeling approach. In* *Organized Crime and Terrorist Networks* *(pp. 117-140). Routledge.* My goal is to create a simple and intuitive 3D cube with moving spheres, while also providing a way to explore and understand the Cube Model presented in the article.

---

For more detailed help or contributions, refer to the code comments and documentation. I created this app with React. If you want to create yours as well, check the instructions below. Have fun!

--- 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# 3D-Cube-and-Spheres

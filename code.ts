// This plugin creates 5 rectangles on the screen.
const numberOfRectangles = 5;

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

// const nodes: SceneNode[] = [];
// for (let i = 0; i < numberOfRectangles; i++) {
//   const rect = figma.createRectangle();
//   rect.x = i * 150;
//   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
//   figma.currentPage.appendChild(rect);
//   nodes.push(rect);
// }
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);

const colorsMap: [string, string][] = [];

function checkNodeValid(node: SceneNode): node is FrameNode {
  return node.type === "FRAME";
}

function to255(n: number) {
  return Math.round(n * 255 * 100) / 100;
}

function parseFrame(prefix: string, frame: FrameNode) {
  prefix += "-" + frame.name;
  for (const child of frame.children) {
    if (child.type == "FRAME") {
      parseFrame(prefix, child);
    } else if (child.type == "ELLIPSE" || child.type == "RECTANGLE") {
      const fill = child.fills[0] as Paint;
      if (fill && fill.type == "SOLID") {
        // console.log("found chils", prefix + "-" + child.name, fill, colorsMap);
        let key = prefix + "-" + child.name;
        key = key.replace(/\s/g, "_");

        let color = `rgb(${to255(fill.color.r)}, ${to255(
          fill.color.g
        )}, ${to255(fill.color.b)})`;

        colorsMap.push([key, color]);
      }
    }
  }
}

const selected = figma.currentPage.selection[0];
if (selected && checkNodeValid(selected)) {
  parseFrame("-", selected);
}

// Show the result
const html = `
<textarea readonly style="width: 100vw; height: 100vh";>
${colorsMap.reduce((acc, cur) => acc + cur[0] + ": " + cur[1] + ";\n", "")}
</textarea>
`;

figma.showUI(html, { width: 700, height: 700, title: "My title" });

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
// figma.closePlugin();

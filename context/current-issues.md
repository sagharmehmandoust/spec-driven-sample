#when i do this, i got this error ...

#prompt: explore the current-issues.md file and deeply analyze the problem. Only when you have the analysis, give it back to me with the idea of how you're planning to solve it, and then wait for me to give you the green light to execute it.


 Delete Nodes and Edges
Read Liveblocks agent skills before implementing this.
Then read the canvas wrapper component and the existing node and edge mutation helpers.
Selected nodes and edges cannot be deleted from the canvas.
Add a keydown event listener to the canvas wrapper that:
- listens for Delete and Backspace keys
- does not fire when the event target is an input, textarea,
or contenteditable element
- gets currently selected nodes using useNodes()
filtered
by selected state
- gets currently selected edges using useEdges ()
filtered
by selected state
- removes them using the existing Liveblocks collaborative mutation helpers
Do not use React Flow's built-in deleteKeyCode or any React Flow keyboard deletion behavior. All deletions must
go through the existing Liveblocks collaborative state
SO
they sync across all connected clients in real time.
Do not change anything else.
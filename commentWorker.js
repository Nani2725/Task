// commentWorker.js
self.addEventListener('message', (e) => {
    const comments = e.data.comments; // Process comments
    setTimeout(() => {
        self.postMessage(comments); // Send comments back to main thread
    }, 1000); // Simulate loading delay
});

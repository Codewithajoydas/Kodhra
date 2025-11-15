const express = require("express");
const shareRouter = express.Router();
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

shareRouter.post("/", async (req, res) => {
  const ab = req.cookies.ab; // GitHub token stored as cookie
  try {
    // If token missing → redirect user to GitHub OAuth
    if (!ab) {
      const redirect_uri = "http://localhost:3000/auth/github/callback";
      return res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=gist`
      );
    }

    // Extract data safely
    const { filename, content, description } = req.body;

    // Make POST request to GitHub Gist API
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ab}`, // GitHub OAuth token
        "User-Agent": "SnippetManagerApp",
      },
      body: JSON.stringify({
        description: description || "Shared via Snippet Manager",
        public: true,
        files: {
          [filename]: { content },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Failed to create gist",
      });
    }

    // ✅ Success — return Gist details
    return res.json({
      message: "Gist created successfully!",
      gistUrl: data.html_url,
      gistId: data.id,
      filename,
    });
  } catch (error) {
    console.error("Error sharing gist:", error);
    return res.status(500).json({
      error: "Something went wrong while creating gist.",
    });
  }
  res.json({ message: "Gist created successfully!" });
});

// shareRouter.post("/", (req, res) => {
//     res.json({ message: "Gist created successfully!" });
// });

module.exports = shareRouter;

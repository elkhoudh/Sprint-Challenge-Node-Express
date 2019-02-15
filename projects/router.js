const express = require("express");
const Projects = require("./projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then(projects => res.json(projects))
    .catch(() => res.status(500).json({ message: "Failed to get projects" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Projects.get(id)
    .then(project => {
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: "Project Not Found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.get("/actions/:id", (req, res) => {
  const { id } = req.params;

  Projects.get(id)
    .then(project => {
      if (project) {
        Projects.getProjectActions(id).then(actions => {
          res.json(actions);
        });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

router.post("/", (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(422).json({ message: "Name and Description Required" });
  } else {
    Projects.insert({ name, description })
      .then(result => {
        if (result) {
          Projects.get().then(projects => {
            res.json(projects);
          });
        }
      })
      .catch(() => res.status(500).json({ message: "Server Error" }));
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(422).json({ message: "Name and Description Required" });
  } else {
    Projects.get(id)
      .then(project => {
        if (project) {
          Projects.update(id, { name, description }).then(result => {
            if (result) {
              Projects.get().then(projects => {
                res.json(projects);
              });
            } else {
              res.status(404).json({ message: "Project Not Found" });
            }
          });
        } else {
          res.status(404).json({ message: "Project Not Found" });
        }
      })
      .catch(() => res.status(500).json({ message: "Server Error" }));
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Projects.remove(id)
    .then(result => {
      if (result) {
        Projects.get().then(projects => res.json(projects));
      } else {
        res.status(500).json({ message: "Failed to delete project" });
      }
    })
    .catch(() => res.status(500).json({ message: "Server Error" }));
});

module.exports = router;

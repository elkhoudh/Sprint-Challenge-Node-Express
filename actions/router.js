const express = require("express");
const Actions = require("./actionModel");
const Projects = require("../projects/projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.json(actions);
    })
    .catch(() => res.status(500).json({ message: "Failed to get actions" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Actions.get(id)
    .then(action => {
      if (action) {
        res.json(action);
      } else {
        res.status(404).json({ message: "Action not found" });
      }
    })
    .catch(() => res.status(500).json({ message: "Server Error" }));
});

router.post("/:id", (req, res) => {
  const { id } = req.params;
  const { description, notes } = req.body;

  if (!description || !notes) {
    res.status(422).json({ message: "Description and Notes required" });
  } else {
    Projects.get(id)
      .then(project => {
        if (project) {
          Actions.insert({ description, notes, project_id: id })
            .then(result => {
              res.json(result);
            })
            .catch(() =>
              res.status(500).json({ message: "Failed to add action" })
            );
        } else {
          res.status(404).json({ message: "Project Not Found" });
        }
      })
      .catch(() => res.status(500).json({ message: "Server Error" }));
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { notes, description } = req.body;
  if (!description || !notes) {
    res.status(422).json({ message: "Description and Notes required" });
  } else {
    Actions.update(id, { notes, description })
      .then(result => {
        if (result) {
          Actions.get().then(actions => {
            res.json(actions);
          });
        } else {
          res.status(404).json({ message: "Failed to update Actions" });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "Server Error" });
      });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Actions.remove(id)
    .then(result => {
      if (result) {
        Actions.get().then(actions => {
          res.json(actions);
        });
      } else {
        res.status(400).json({ message: "Failed to delete actions" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;

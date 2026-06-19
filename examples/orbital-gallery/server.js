const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const IMAGES_DIR = path.join(ROOT_DIR, "images");
const AUDIO_DIR = path.join(ROOT_DIR, "audio");

fs.mkdirSync(IMAGES_DIR, { recursive: true });
fs.mkdirSync(AUDIO_DIR, { recursive: true });

app.use(express.static(PUBLIC_DIR));
app.use("/images", express.static(IMAGES_DIR));
app.use("/audio", express.static(AUDIO_DIR));

const imageExt = new Set([".png", ".jpg", ".jpeg"]);
const audioExt = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".webm"]);

function cleanName(originalName) {
  const parsed = path.parse(originalName);
  const safeBase = parsed.name
    .normalize("NFKD")
    .replace(/[^\w\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const ext = parsed.ext.toLowerCase();
  return `${Date.now()}-${safeBase || "file"}${ext}`;
}

function createStorage(directory) {
  return multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, directory);
    },
    filename: function (_req, file, cb) {
      cb(null, cleanName(file.originalname));
    }
  });
}

function createFileFilter(allowedExt, label) {
  return function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.has(ext)) {
      return cb(new Error(`${label} file type is not supported.`));
    }

    cb(null, true);
  };
}

const uploadImage = multer({
  storage: createStorage(IMAGES_DIR),
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  fileFilter: createFileFilter(imageExt, "Image")
});

const uploadAudio = multer({
  storage: createStorage(AUDIO_DIR),
  limits: {
    fileSize: 80 * 1024 * 1024
  },
  fileFilter: createFileFilter(audioExt, "Audio")
});

async function listFiles(directory, allowedExt, publicBase) {
  const files = await fs.promises.readdir(directory);

  const items = await Promise.all(
    files
      .filter((file) => allowedExt.has(path.extname(file).toLowerCase()))
      .map(async (file) => {
        const fullPath = path.join(directory, file);
        const stat = await fs.promises.stat(fullPath);

        return {
          name: file,
          url: `${publicBase}/${encodeURIComponent(file)}`,
          size: stat.size,
          modifiedAt: stat.mtimeMs
        };
      })
  );

  return items.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

app.get("/api/images", async (_req, res) => {
  try {
    const images = await listFiles(IMAGES_DIR, imageExt, "/images");
    res.json({ images });
  } catch (_error) {
    res.status(500).json({
      error: "Failed to read image folder."
    });
  }
});

app.post("/api/images", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No image uploaded."
    });
  }

  res.json({
    image: {
      name: req.file.filename,
      url: `/images/${encodeURIComponent(req.file.filename)}`
    }
  });
});

app.get("/api/audio", async (_req, res) => {
  try {
    const audio = await listFiles(AUDIO_DIR, audioExt, "/audio");
    res.json({ audio });
  } catch (_error) {
    res.status(500).json({
      error: "Failed to read audio folder."
    });
  }
});

app.post("/api/audio", uploadAudio.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No audio uploaded."
    });
  }

  res.json({
    audio: {
      name: req.file.filename,
      url: `/audio/${encodeURIComponent(req.file.filename)}`
    }
  });
});

app.use((error, _req, res, _next) => {
  res.status(400).json({
    error: error.message || "Request failed."
  });
});

app.listen(PORT, () => {
  console.log(`Personal gallery running at http://localhost:${PORT}`);
});
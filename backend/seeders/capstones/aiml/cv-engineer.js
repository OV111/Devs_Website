/**
 * Capstone brief — cv-engineer track (cv-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the roadmap layer that teaches it, for weak-spot tracking.
 * - Bump `version` for any change that affects grading; never edit a
 *   published version in place (attempts point at the exact brief document).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "cv-engineer",
  categoryId: "aiml",
  slug: "cv-engineer-defect-detection",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Industrial Defect Detection and Real-Time Inspection System",
  summary:
    "Build a production computer vision pipeline that processes visual industrial inspections. " +
    "You will perform image augmentation, train a custom PyTorch object detection model (YOLO or U-Net segmentation), " +
    "export the trained model to ONNX, and serve real-time frame inference via FastAPI.",
  stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "data-pipeline",
      text: "Builds a PyTorch Dataset loading images with augmentations (Albumentations) including flips, color shifts, and rotations.",
    },
    {
      id: "classical-preprocessing",
      text: "Applies OpenCV preprocessing routines (thresholding, contour extraction, edge detection) for ROI pre-filtering.",
    },
    {
      id: "model-training",
      text: "Trains a deep learning model (YOLO for detection or U-Net for segmentation) using custom loss functions and mAP/IoU tracking.",
    },
    {
      id: "model-export",
      text: "Exports model weights to ONNX format, configuring dynamic batch sizes for optimized inference.",
    },
    {
      id: "fastapi-stream",
      text: "FastAPI server receives image frames via multipart/form-data or WebSockets and returns annotated bounding boxes and defect metrics.",
    },
    {
      id: "nms-postprocess",
      text: "Implements custom Non-Maximum Suppression (NMS) or mask thresholding post-processing logic.",
    },
    {
      id: "tests",
      text: "Pytest suite validates image transformation shapes, NMS bounding box calculations, and API endpoint responses.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details dataset preparation, training procedures, mAP/IoU benchmark results, and container setup.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Environment config file contains model weights directory, confidence threshold settings, and environment variables.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Dockerfile packages FastAPI service, OpenCV dependencies, and ONNX Runtime for deployment.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes linting checks and automated tests on every push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "data-augmentation",
      name: "Data Processing & Augmentation",
      weight: 20,
      layerId: "cv-engineer-9",
      description:
        "Robust data loaders, realistic augmentations, and OpenCV pre-filtering to handle lighting and noise variation.",
    },
    {
      id: "model-architecture",
      name: "Detection/Segmentation Training",
      weight: 25,
      layerId: "cv-engineer-7",
      description:
        "Correct implementation of model architecture, custom loss functions, and accurate mAP or IoU evaluation.",
    },
    {
      id: "postprocessing",
      name: "Post-Processing & Optimization",
      weight: 15,
      layerId: "cv-engineer-7",
      description:
        "Accurate NMS/contour extraction implementation and successful ONNX export configuration.",
    },
    {
      id: "api-performance",
      name: "Serving & Latency",
      weight: 15,
      layerId: "cv-engineer-10",
      description:
        "FastAPI endpoint handles binary image inputs efficiently with low-latency inference.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "cv-engineer-4",
      description:
        "Unit tests accurately cover image shape transformations, box coordinates logic, and endpoint failure cases.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Containerization",
      weight: 10,
      layerId: "cv-engineer-10",
      description:
        "Clear setup guide, evaluation metrics visualization, and working Docker container.",
    },
  ],

  twistPool: [
    {
      id: "video-stream",
      text: "Add a WebSocket streaming endpoint that accepts an RTSP or continuous video stream and streams back annotated frames.",
    },
    {
      id: "segmentation-masks",
      text: "Extend the system to compute precise polygon area calculations for detected surface defects in square millimeters.",
    },
    {
      id: "int8-quantization",
      text: "Add an INT8-quantized ONNX Runtime variant and report the latency and accuracy trade-off against the FP32 model on CPU.",
    },
    {
      id: "anomaly-detection",
      text: "Implement an unsupervised Autoencoder fallback for detecting unseen novel structural defects outside training classes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

import { ObjectId } from "mongodb";
import {
  getResourcesService,
  getResourceByIdService,
  getResourcesByLayerService,
  getResourceCountsByTypeService,
  toggleSaveResourceService,
  getSavedResourceIdsService,
} from "../services/libraryService.js";

export const getResources = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await getResourcesService(db, req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getResourceById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid resource id" });
    }
    const db = req.app.locals.db;
    const resource = await getResourceByIdService(db, req.params.id);
    res.json({ success: true, data: resource });
  } catch (err) {
    const status = err.message === "Resource not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const getResourcesByLayer = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const resources = await getResourcesByLayerService(db, req.params.layerId);
    res.json({ success: true, data: resources });
  } catch (err) {
    const status = err.message === "Invalid layer id" ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const toggleSaveResource = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid resource id" });
    }
    const db = req.app.locals.db;
    const result = await toggleSaveResourceService(db, req.params.id, req.user._id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSavedResourceIds = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ids = await getSavedResourceIdsService(db, req.user._id);
    res.json({ success: true, ids });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getResourceCounts = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const counts = await getResourceCountsByTypeService(db);
    res.json({ success: true, data: counts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

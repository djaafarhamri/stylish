import express from "express";
import { getNotification, getPayment, getSEO, getShipping, getStore, setNotification, setPayment, setSEO, setShipping, setStore } from "../controllers/settings-controllers";

const router = express.Router();

// Public routes

router.get("/store", getStore)
router.put("/store", setStore)

router.get("/seo", getSEO)
router.put("/seo", setSEO)

router.get("/shipping", getShipping)
router.put("/shipping", setShipping)

router.get("/payment", getPayment)
router.put("/payment", setPayment)

router.get("/notification", getNotification)
router.put("/notification", setNotification)

export default router;

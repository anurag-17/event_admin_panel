const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createSynonyms, editSynonym, getAllSynonyms, getSynonymById, getSynonymsByParentId } = require("../controllers/synonymsCont");
const router = express.Router();

router.route("/create").post(isAuthenticatedUser,authorizeRoles("admin"),createSynonyms)
router.route("/edit/:id").post(isAuthenticatedUser,authorizeRoles("admin"), editSynonym)
router.route("/getAll").get(isAuthenticatedUser,authorizeRoles("admin"),getAllSynonyms)
router.route("/getbyId/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSynonymById)
router.route("/getbyparent/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSynonymsByParentId)

module.exports = router;
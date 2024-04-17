const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createSynonyms, editSynonym, getAllSynonyms, getSynonymById, getSynonymsByParentId } = require("../controllers/synonymsCont");

router.post("/create",isAuthenticatedUser,authorizeRoles("admin"),createSynonyms)
router.put("/edit/:id",isAuthenticatedUser,authorizeRoles("admin"), editSynonym)
// router.route("/edit/:id").put(isAuthenticatedUser,authorizeRoles("admin"), editSynonym)
router.route("/getAll").get(isAuthenticatedUser,authorizeRoles("admin"),getAllSynonyms)
router.route("/getbyId/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSynonymById)
router.route("/getbyparent/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSynonymsByParentId)

module.exports = router;
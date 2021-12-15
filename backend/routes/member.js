const express = require('express');
const router = express.Router();

const {
    newMember,
    memberDetail,
    getAllMemberByRole,
    createMemberReview,
    updateMember,
    deleteMember,
    deleteMemberReview,
    getAllMemberNames,

} = require('../controllers/memberController');

router.route('/members/new').post(newMember);
router.route('/members/:id').get(memberDetail);
router.route('/members').get(getAllMemberByRole);
router.route('/members/:id').put(updateMember);
router.route('/members/:id').delete(deleteMember);
router.route('/members/new/reviews').put(createMemberReview);
router.route('/members/all/reviews').get(getAllMemberNames);
router.route('/members/delete/reviews').delete(deleteMemberReview);



module.exports = router;
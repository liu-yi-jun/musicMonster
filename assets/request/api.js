module.exports = {
  getToken: "/api/user/getToken",
  login: "/api/user/login",
  getServerUserInfo: "/api/user/getServerUserInfo",
  simpleGetServerUserInfo: "/api/user/simpleGetServerUserInfo",
  register: "/api/user/register",
  getAllGroup: "/api/group/getAllGroup",
  createGroup: "/api/group/createGroup",
  uploadImg: '/api/upload/uploadImg',
  getGroupInfo: '/api/group/getGroupInfo',
  pagingGetJoinGroup: '/api/group/pagingGetJoinGroup',
  pagingGetSettleGroup: '/api/group/pagingGetSettleGroup',
  newNumber: '/api/group/newNumber',
  modifyGroup: '/api/group/modifyGroup',
  pagingGetFollowGroup: '/api/group/pagingGetFollowGroup',
  dissolutionGroup: '/api/group/dissolutionGroup',
  signOutGroup: '/api/user/signOutGroup',
  changeBgWall: '/api/user/changeBgWall',
  updateUserInfo: "/api/user/updateUserInfo",
  groupAdmini: "/api/user/groupAdmini",
  groupMember: "/api/user/groupMember",
  addManage: "/api/user/addManage",
  searchGroupMember: "/api/user/searchGroupMember",
  searchGroup: "/api/group/searchGroup",
  pictureIssue: "/api/groupdynamics/pictureIssue",
  videoIssue: "/api/groupdynamics/videoIssue",
  voiceIssue: "/api/groupdynamics/voiceIssue",
  groupPagingGetGroupdynamics: "/api/groupdynamics/groupPagingGetGroupdynamics",
  issueGroupCard: "/api/groupcard/issueGroupCard",
  cardDelete: "/api/groupcard/cardDelete",
  getPagingGroupCard: "/api/groupcard/getPagingGroupCard",
  issueGroupCardRecord: "/api/groupcardrecord/issueGroupCardRecord",
  getPagingGroupCardRecord: "/api/groupcardrecord/getPagingGroupCardRecord",
  groupCardRecordLike: "/api/groupcardrecord/groupCardRecordLike",
  deleteGroupCardRecord: "/api/groupcardrecord/deleteGroupCardRecord",
  addCourse: "/api/groupcourse/addCourse",
  getCourses: "/api/groupcourse/getCourses",
  courseDetail: "/api/groupcourse/courseDetail",
  saveCourse: "/api/groupcourse/saveCourse",
  sendSingIn: "/api/user/sendSingIn",
  getRandomGroup: "/api/group/getRandomGroup",
  issueTeam: "/api/band/issueTeam",
  saveTeam: "/api/band/saveTeam",
  getBands: "/api/band/getBands",
  followGroup: "/api/group/followGroup",
  groupdynamicsLike: "/api/groupdynamics/groupdynamicsLike",
  groupdynamicsStore: "/api/groupdynamics/groupdynamicsStore",
  groupcourseLike: "/api/groupcourse/groupcourseLike",
  groupcourseStore: "/api/groupcourse/groupcourseStore",
  courseCommont: "/api/groupcourse/courseCommont",
  myStoreCourse: "/api/groupcourse/myStoreCourse",
  dynamicDetailAndCommont: "/api/groupdynamics/dynamicDetailAndCommont",
  sendComment: "/api/comment/sendComment",
  sendReply: "/api/comment/sendReply",
  getCommentSum: "/api/comment/getCommentSum",
  deletecomment: "/api/comment/deletecomment",
  deletereply: "/api/comment/deletereply",
  share: "/api/index/share",
  allTopic: "/api/index/allTopic",
  getNotice: "/api/index/getNotice",
  analysis: "/api/index/analysis",
  myRelease: "/api/index/myRelease",
  codeCheck: "/api/index/codeCheck",

  sendFinalSystemMsg: "/api/index/sendFinalSystemMsg",
  squarePost: "/api/squaredynamics/squarePost",
  tempdynamic: "/api/squaredynamics/tempdynamic",
  getTempDynamic: "/api/squaredynamics/getTempDynamic",
  deleteTempdynamic: "/api/squaredynamics/deleteTempdynamic",
  getSquaredynamics: "/api/squaredynamics/getSquaredynamics",
  squaredynamicsLike: "/api/squaredynamics/squaredynamicsLike",
  squaredynamicsStore: "/api/squaredynamics/squaredynamicsStore",
  postAlliance: "/api/alliance/postAlliance",
  getAlliance: "/api/alliance/getAlliance",
  getSimpleAlliance: "/api/alliance/getSimpleAlliance",
  allianceDetailAndCommont: "/api/alliance/allianceDetailAndCommont",
  allianceLike: "/api/alliance/allianceLike",
  allianceStore: "/api/alliance/allianceStore",
  myStoreAlliance: "/api/alliance/myStoreAlliance",
  personalInvitatio: "/api/user/personalInvitatio",
  getDynamics: "/api/squaredynamics/getDynamics",
  myStoreDynamic: "/api/squaredynamics/myStoreDynamic",
  personalAlliance: "/api/alliance/personalAlliance",
  followUser: "/api/user/followUser",
  getUserFollow: "/api/user/getUserFollow",
  getUserFan: "/api/user/getUserFan",
  generateCode: "/api/user/generateCode",
  secondIssue: "/api/second/secondIssue",
  searchSeconds: "/api/second/searchSeconds",
  followSecond: "/api/second/followSecond",
  ticketIssue: "/api/ticket/ticketIssue",
  searchTickets: "/api/ticket/searchTickets",
  followTicket: "/api/ticket/followTicket",
  topicDynamic: "/api/squaredynamics/topicDynamic",
  getRandomSong: "/api/song/getRandomSong",
  storeSong: "/api/song/storeSong",
  getMyStoreSong: "/api/song/getMyStoreSong",
  getInform: "/api/inform/getInform",
  readAllInform: "/api/inform/readAllInform",
  noticeNumbe: "/api/inform/noticeNumbe",
  joinBand: "/api/band/joinBand",
  getSystem: "/api/system/getSystem",
  cancelSystemNew: "/api/system/cancelSystemNew",
  getFestival: "/api/performance/getFestival",
  getLiveHouse: "/api/performance/getLiveHouse",
  musicfestivalDetail: "/api/performance/musicfestivalDetail",
  musicfestivalStore: "/api/performance/musicfestivalStore",
  musicfestivalLike: "/api/performance/musicfestivalLike",
  musicfestivalComment: "/api/performance/musicfestivalComment",
  myStorePerformance: "/api/performance/myStorePerformance",
  groupcourseDelete: "/api/groupcourse/groupcourseDelete",
  squaredynamicsDelete: "/api/squaredynamics/squaredynamicsDelete",
  groupdynamicsDelete: "/api/groupdynamics/groupdynamicsDelete",
  allianceDelete: "/api/alliance/allianceDelete",
  secondDelete: "/api/second/secondDelete",
  ticketDelete: "/api/ticket/ticketDelete",
  bandDelete: "/api/band/bandDelete",
  livehouseStore: "/api/performance/livehouseStore",
  livehouseLike: "/api/performance/livehouseLike",
  livehouseComment: "/api/performance/livehouseComment",
  livehouseDetail: "/api/performance/livehouseDetail",
  myStoreSecond: "/api/second/myStoreSecond",
  mySecond: "/api/second/mySecond",
  myStoreTicket: "/api/ticket/myStoreTicket",
  myTicket: "/api/ticket/myTicket",
  getRandomTap: "/api/tap/getRandomTap",
  getTapDetail: "/api/tap/getTapDetail",
  issueTapRecord: "/api/tap/issueTapRecord",
  getTaps: "/api/tap/getTaps",
  searchTap: "/api/tap/searchTap",
  modifyInform: "/api/inform/modifyInform",
  secondDetailAndCommont: "/api/second/secondDetailAndCommont",
  secondLike: "/api/second/secondLike",
  secondStore: "/api/second/secondStore",
  ticketDetailAndCommont: "/api/ticket/ticketDetailAndCommont",
  ticketLike: "/api/ticket/ticketLike",
  ticketStore: "/api/ticket/ticketStore",
  getGuitar: "/api/svg/getGuitar",
  pagingGetGroup: "/api/group/pagingGetGroup",
  joinGroup: "/api/group/joinGroup",
  switchGroup: "/api/group/switchGroup",
  passiveSwitchGroup: "/api/group/passiveSwitchGroup",
  agreeApply: "/api/group/agreeApply",
  refuseApply: "/api/group/refuseApply",
  bandDetail: "/api/band/bandDetail",
  bandDetailAndCommont: "/api/band/bandDetailAndCommont",
  bandLike: "/api/band/bandLike",
  bandStore: "/api/band/bandStore",
  myStoreBand: "/api/band/myStoreBand",
  myBand: "/api/band/myBand",
  getMysquareDynamics: "/api/squareDynamics/getMysquareDynamics",
  getMygroupdDynamics: "/api/groupdynamics/getMygroupdDynamics",
  sendSubscribeInfo: "/api/inform/sendSubscribeInfo",
  issueTap: "/api/tap/issueTap",
  feedback: "/api/index/feedback",
  report: "/api/index/report",
  deleteSystemMsg: "/api/index/deleteSystemMsg",
  getSystemMsg: "/api/index/getSystemMsg",
  sendSystemMsg: "/api/index/sendSystemMsg",
  getUnlimited: "/api/group/getUnlimited",
  simpleGroupInfo: "/api/group/simpleGroupInfo",
  simpleJoinGroup: "/api/group/simpleJoinGroup",
  issueMoment: "/api/bandMoment/issueMoment",
  getMoment: "/api/bandMoment/getMoment",
  momentDetailAndCommont: "/api/bandMoment/momentDetailAndCommont",
  bandmomentLike: "/api/bandMoment/bandmomentLike",
  bandmomentStore: "/api/bandMoment/bandmomentStore",
  bandmomentDelete: "/api/bandMoment/bandmomentDelete",
  mybandmoment: "/api/bandMoment/mybandmoment",
  myStoreMoment: "/api/bandMoment/myStoreMoment",
  signInInfo: "/api/index/signInInfo",
  closeEveryday: "/api/index/closeEveryday",
  signInPost: "/api/index/signInPost",
}
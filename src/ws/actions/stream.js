import Store from "@/store";

const normalize = data => ({
  commentsCount: 5,
  finishedAt: null,
  id: data.id,
  isActive: data.is_active,
  isFinished: data.is_finished,
  likesCount: 0,
  mediaIsReady: data.media_is_ready,
  mediaPreview: data.media_preview,
  mediaSrc: data.media_src,
  mediaThumb: null,
  mediaType: data.media_type,
  room: data.system_name,
  startedAt: data.start_date,
  thumbUrl: data.thumb_url,
  type: data.type,
  user: {
    id: data.user_id,
    name: data.user_name,
    username: data.user_username,
    avatar: data.user_avatar,
    header: null
  },
  viewsCount: 0
});

export default data => {
  Store.commit("lives/addNewOne", normalize(data));
};

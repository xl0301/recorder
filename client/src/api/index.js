import http from "../utils/http";

export const uploadVideoApi = function (events) {
  return http({
    method: "post",
    url: "/api/upload_video",
    data: {
      events: events,
    },
  });
};
export const fetchVideoApi = function () {
  return http({
    method: "post",
    url: "/api/fetch_video",
  });
};

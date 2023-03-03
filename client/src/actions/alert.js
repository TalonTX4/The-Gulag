import { v4 as uuidV4 } from "uuid"
import { SET_ALERT, REMOVE_ALERT } from "./types"

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidV4
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  })
}

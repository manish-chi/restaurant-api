import * as handlerFactory from "../controllers/handlerFactory.js";
import Reservation from "../models/reservationModel.js";

export const MakeReservation = handlerFactory.addOne(Reservation);

export const GetReservation = handlerFactory.getOne(Reservation);


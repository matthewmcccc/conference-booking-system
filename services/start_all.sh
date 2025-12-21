#!/bin/bash

cd auth-service && npm run dev &
cd booking-service && npm run dev &
cd location-service && npm run dev &
cd room-service && npm run dev &
cd weather-service && npm run dev &
cd api-gateway && npm run dev

wait
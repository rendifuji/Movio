import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { UserLayout, AdminLayout } from "./layouts";
import {
  Login,
  NotFound,
  AdminDashboard,
  Home,
  MovieDetails,
  BookSeats,
  MyTickets,
  AdminMovies,
  Checkout,
  TicketDetail,
  AdminSchedules,
} from "./pages";
import PageTitle from "./components/general/PageTitle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PageTitle title="Login | Movio">
              <Login />
            </PageTitle>
          }
        />

        <Route element={<UserLayout />}>
          <Route
            path="/"
            element={
              <PageTitle title="Home | Movio">
                <Home />
              </PageTitle>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <PageTitle title="My Tickets | Movio">
                <MyTickets />
              </PageTitle>
            }
          />
          <Route
            path="/checkout/:movieId"
            element={
              <PageTitle title="Checkout | Movio">
                <Checkout />
              </PageTitle>
            }
          />
          <Route
            path="/ticket/:ticketId"
            element={
              <PageTitle title="Ticket Detail | Movio">
                <TicketDetail />
              </PageTitle>
            }
          />
        </Route>

        <Route
          path="/movie/:movieId"
          element={
            <PageTitle title="Movie Details | Movio">
              <MovieDetails />
            </PageTitle>
          }
        />

        <Route
          path="/book/:movieId"
          element={
            <PageTitle title="Book Seats | Movio">
              <BookSeats />
            </PageTitle>
          }
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={
              <PageTitle title="Admin Overview | Movio">
                <AdminDashboard />
              </PageTitle>
            }
          />
          <Route
            path="movies"
            element={
              <PageTitle title="Manage Movies | Admin">
                <AdminMovies />
              </PageTitle>
            }
          />
          <Route
            path="schedules"
            element={
              <PageTitle title="Schedules | Admin">
                <AdminSchedules />
              </PageTitle>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <PageTitle title="404 Not Found">
              <NotFound />
            </PageTitle>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserLayout, AdminLayout } from "./layouts";
import { ProtectedRoute, PageTitle } from "@/components";
import { SeatLockProvider } from "@/contexts";
import {
  Login,
  Register,
  GoogleCallback,
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SeatLockProvider>
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
            <Route
              path="/register"
              element={
                <PageTitle title="Register | Movio">
                  <Register />
                </PageTitle>
              }
            />
            <Route
              path="/auth/google/callback"
              element={
                <PageTitle title="Signing in... | Movio">
                  <GoogleCallback />
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
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageTitle title="My Tickets | Movio">
                      <MyTickets />
                    </PageTitle>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/:movieId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageTitle title="Checkout | Movio">
                      <Checkout />
                    </PageTitle>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ticket/:ticketId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageTitle title="Ticket Detail | Movio">
                      <TicketDetail />
                    </PageTitle>
                  </ProtectedRoute>
                }
              />
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
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <PageTitle title="Book Seats | Movio">
                      <BookSeats />
                    </PageTitle>
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
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
      </SeatLockProvider>
    </QueryClientProvider>
  </StrictMode>
);

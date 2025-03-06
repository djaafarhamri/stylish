import apiClient from "@/lib/api-client"
import type { Address, AddressesResponse, AddressResponse, LoginRequest, LoginResponse, ProfileRequest, SignupRequest, User } from "@/types/api"

export const AuthService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post("/users/login", credentials)

    return data
  },

  // Register new user
  async signup(userData: SignupRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post("/users/register", userData)

    return data
  },
  // update profile
  async updateProfile(userData: ProfileRequest): Promise<LoginResponse> {
    const { data } = await apiClient.put("/users/update-profile", userData)

    return data
  },
  
  // add address
  async addAddress(addressData: Address): Promise<AddressResponse> {
    const { data } = await apiClient.post("/users/adress", addressData)

    return data
  },
  
  // add address
  async updateAddress(addressData: Address, id: string): Promise<AddressResponse> {
    const { data } = await apiClient.put(`/users/address/${id}`, addressData)

    return data
  },
  
  // add address
  async deleteAddress(id: string): Promise<AddressResponse> {
    const { data } = await apiClient.delete(`/users/adress/${id}`)

    return data
  },
  
  // get my address
  async getMyAddresses(): Promise<AddressesResponse> {
    const { data } = await apiClient.get(`/users/adress/me`)

    return data
  },
  
  // Logout user
  async logout(): Promise<void> {
    // Optionally call logout endpoint to invalidate token on server
    await apiClient.post("/users/logout")
  },

  // Get current user profile
  async getCurrentUser(): Promise<LoginResponse> {
    const { data } = await apiClient.get("/users/me")
    return data
  },
}


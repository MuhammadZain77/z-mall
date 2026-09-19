import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, TechCategory } from "@/types/product";
import { fetchAllProducts, fetchProductById } from "@/lib/api/fakestore";

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: TechCategory;
  searchQuery: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating";
  maxPrice: number;
  activeProduct: Product | null;
}

const initialState: ProductsState = {
  items: [],
  isLoading: true, // Start in loading state until catalog is loaded
  error: null,
  selectedCategory: "all",
  searchQuery: "",
  sortBy: "featured",
  maxPrice: 3000,
  activeProduct: null,
};

// Async thunk to fetch from FakeStoreAPI
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllProducts();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      return rejectWithValue(message);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "products/getSingleProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await fetchProductById(id);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load product";
      return rejectWithValue(message);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<TechCategory>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"featured" | "price-asc" | "price-desc" | "rating">
    ) => {
      state.sortBy = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setActiveProduct: (state, action: PayloadAction<Product | null>) => {
      state.activeProduct = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = "all";
      state.searchQuery = "";
      state.sortBy = "featured";
      state.maxPrice = 3000;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load products";
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProduct = action.payload;
        }
      });
  },
});

export const {
  setCategory,
  setSearchQuery,
  setSortBy,
  setMaxPrice,
  setActiveProduct,
  resetFilters,
} = productsSlice.actions;

// Selectors
export const selectTotalProductsCount = (state: { products: ProductsState }) =>
  state.products.items.length;

export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.isLoading;

export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;

// Filtered and Sorted products selector
export const selectFilteredProducts = (state: { products: ProductsState }) => {
  const { items, selectedCategory, searchQuery, sortBy, maxPrice } =
    state.products;

  return items
    .filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.techCategory !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesDesc) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating")
        return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
      return a.id - b.id; // default featured
    });
};

export default productsSlice.reducer;

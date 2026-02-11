/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMyCartThunk } from "@/redux/cartSlice";
import { logout } from "@/redux/authSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const [search, setSearch] = useState("");
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(
    null,
  );

  const openCategory = Boolean(categoryAnchor);
  const openLang = Boolean(langAnchor);
  const openAccount = Boolean(accountAnchor);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user?.id) {
      dispatch(getMyCartThunk(user.id));
    }
  }, [dispatch, user]);

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const handleCategorySelect = (category: string) => {
    setCategoryAnchor(null);

    if (category === "All Categories") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ py: 1, backgroundColor: "#ffffff" }}>
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => router.push("/dashboard")}
          >
            <img
              src="https://img.freepik.com/free-vector/man-riding-scooter-white-background_1308-46379.jpg?semt=ais_user_personalization&w=740&q=80"
              alt="Amazon"
              style={{
                width: "3rem",
                height: "3rem",
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              color: "white",
              ml: 1,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: 30, mr: 0.5, color: "black" }}
            />
            <Box>
              <Typography sx={{ fontSize: 20, color: "#000000" }}>
                Deliver to
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: 600, color: "black" }}
              >
                {user?.username || "India"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
              mx: 2,
            }}
          >
            <Box
              sx={{
                px: 2,
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                borderRadius:"2px",
                borderRight: "1px solid #000000",
                backgroundColor: "black",
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "fangsong",
                cursor: "pointer",
                color: "white",
              }}
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
            >
              All <ArrowDropDownIcon fontSize="small" />
            </Box>

            <Menu
              anchorEl={categoryAnchor}
              open={openCategory}
              onClose={() => setCategoryAnchor(null)}
            >
              {[
                "All Categories",
                "Chinese",
                "South Indian",
                "Korean",
                "French",
              ].map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </Menu>

            <InputBase
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search for dishes here"
              sx={{
                flex: 1,
                px: 3,
                py: 1,
                borderTop:"1px solid black",
                 borderBottom:"1px solid black",
                background: "offwhite",
                "& input::placeholder": {
                  color: "gray",
                  fontSize: "18px",
                  fontWeight: 700,
                  opacity: 1,
                },
              }}
            />

            <IconButton
              onClick={handleSearch}
              sx={{
                backgroundColor: "#ee7829",
                borderRadius: 0,
                px: 2,
                "&:hover": { backgroundColor: "#f3a847" },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              color: "white",
              cursor: "pointer",
            }}
            onClick={(e) => setLangAnchor(e.currentTarget)}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "black" }}>
              EN <ArrowDropDownIcon fontSize="small" />
            </Typography>
          </Box>

          <Menu
            anchorEl={langAnchor}
            open={openLang}
            onClose={() => setLangAnchor(null)}
          >
            {["English", "हिन्दी"].map((lang) => (
              <MenuItem key={lang}>{lang}</MenuItem>
            ))}
          </Menu>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              color: "white",
              cursor: "pointer",
              ml: 2,
            }}
            onClick={(e) => {
              if (!user) {
                router.push("/authentication/login");
              } else {
                setAccountAnchor(e.currentTarget);
              }
            }}
          >
            <Typography sx={{ fontSize: 18, color: "black" }}>
              Hello, {user?.username || "Sign in"}
            </Typography>
            <Typography sx={{ fontSize: 19, fontWeight: 600, color: "black" }}>
              Account <ArrowDropDownIcon fontSize="small" />
            </Typography>
          </Box>

          <Menu
            anchorEl={accountAnchor}
            open={openAccount}
            onClose={() => setAccountAnchor(null)}
          >
            {!user
              ? [
                  <MenuItem
                    key="signin"
                    onClick={() => {
                      setAccountAnchor(null);
                      router.push("/authentication/login");
                    }}
                  >
                    Sign In
                  </MenuItem>,
                ]
              : [
                  <MenuItem
                    key="account"
                    onClick={() => {
                      setAccountAnchor(null);
                      router.push("/account");
                    }}
                  >
                    Your Account
                  </MenuItem>,
                  <MenuItem
                    key="orders"
                    onClick={() => {
                      setAccountAnchor(null);
                      router.push("/orders");
                    }}
                  >
                    Your Orders
                  </MenuItem>,
                  <MenuItem
                    key="wishlist"
                    onClick={() => {
                      setAccountAnchor(null);
                      router.push("/wishlist");
                    }}
                  >
                    Your Wishlist
                  </MenuItem>,
                  <MenuItem
                    key="logout"
                    onClick={() => {
                      dispatch(logout())
                      router.push("/authentication/login");
                    }}
                  >
                    Sign Out
                  </MenuItem>,
                ]}
          </Menu>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              color: "black",
              cursor: "pointer",
              ml: 2,
            }}
            onClick={() => router.push("/orders")}
          >
            <Typography sx={{ fontSize: 16 }}>Returns</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              & Orders
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "black",
              cursor: "pointer",
              ml: 2,
            }}
            onClick={() => router.push("/cart")}
          >
            <Badge badgeContent={cartCount} color="warning">
              <ShoppingCartIcon />
            </Badge>
            <Typography
              sx={{
                ml: 1.5,
                fontsize: 20,
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Cart
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

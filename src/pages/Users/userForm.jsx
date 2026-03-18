import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createuser, updateuser, getuserById } from "../../api/userApi";
import { getRoles } from "../../api/roleApi";
import { useSnackbar } from "../../context/SnackbarContext";

const baseSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().optional(),
  roleId: z.coerce.number().min(1, "Please select a role"),
  isActive: z.boolean(),
});

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  // ================= CONDITIONAL SCHEMA =================

  const schema = baseSchema.superRefine((data, ctx) => {
    if (!isEditMode) {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must be at least 6 characters",
        });
      }
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      roleId: 0,
      isActive: true,
    },
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    loadRoles();

    if (isEditMode) {
      loadUser();
    }
  }, [id]);

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data || []);
    } catch (err) {
      showSnackbar("Failed to load roles", "error");
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await getuserById(id);
      const data = res.data;

      reset({
        fullName: data.fullName || "",
        email: data.email || "",
        password: "",
        roleId: data.roleId ?? 0,
        isActive: data.isActive ?? true,
      });
    } catch {
      showSnackbar("Failed to load user", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================

  const onSubmit = async (data) => {
    data.roleId = Number(data.roleId);
    try {
      setSubmitLoading(true);

      // Remove empty password on edit

      if (isEditMode && !data.password) {
        delete data.password;
      }

      if (isEditMode) {
        await updateuser(id, data);

        showSnackbar("User updated successfully");
      } else {
        await createuser(data);

        showSnackbar("User created successfully");
      }

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    } catch (err) {
      if (err.response?.data?.errors?.Email) {
        setError("email", {
          type: "manual",
          message: err.response.data.errors.Email[0],
        });
      } else {
        showSnackbar(
          err.response?.data?.message || "Error saving user",
          "error"
        );
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  // ================= LOADING =================

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          {isEditMode ? "Edit User" : "Create User"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <TextField
            fullWidth
            label="Full Name"
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            disabled={submitLoading}
            sx={{ mb: 2 }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={submitLoading}
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label={isEditMode ? "New Password (optional)" : "Password"}
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={submitLoading}
            sx={{ mb: 2 }}
          />

          {/* Role */}
          <TextField
            select
            fullWidth
            label="Role"
            value={watch("roleId") || 0}
            onChange={(e) => setValue("roleId", Number(e.target.value))}
            error={!!errors.roleId}
            helperText={errors.roleId?.message}
          >
            <MenuItem value={0}>Select Role</MenuItem>

            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Status */}
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="success"
                    disabled={submitLoading}
                  />
                }
                label={field.value ? "Active User" : "Inactive User"}
              />
            )}
          />

          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/users")}
              disabled={submitLoading}
            >
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update User"
                : "Create User"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
//   MenuItem,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createuser, updateuser, getuserById } from "../../api/userApi";

// // ================= VALIDATION =================
// const schema = z.object({
//   fullName: z.string().min(3, "Full Name is required"),
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be 6+ chars").optional(),
//   roleId: z.coerce.number().min(1, "Role is required"),
//   isActive: z.boolean(),
// });

// const UserForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const isEditMode = Boolean(id);
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setValue,
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       roleId: "",
//       isActive: true,
//     },
//   });

//   // ================= LOAD USER (EDIT) =================
//   useEffect(() => {
//     if (isEditMode) {
//       loadUser();
//     }
//   }, [id]);

//   const loadUser = async () => {
//     try {
//       setLoading(true);
//       const res = await getuserById(id);
//       const data = res.data;

//       reset({
//         fullName: data.fullName,
//         email: data.email,
//         password: "",
//         roleId: data.roleId,
//         isActive: data.isActive,
//       });
//     } catch (err) {
//       console.error("Load User Error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= SUBMIT =================
//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       if (isEditMode) {
//         await updateuser(id, data);
//       } else {
//         await createuser(data);
//       }

//       navigate("/users");
//     } catch (err) {
//       console.error("Save User Error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box p={3} maxWidth={500} mx="auto">
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h5" mb={3}>
//           {isEditMode ? "Edit User" : "Create User"}
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Full Name */}
//           <TextField
//             fullWidth
//             label="Full Name"
//             {...register("fullName")}
//             error={!!errors.fullName}
//             helperText={errors.fullName?.message}
//           />

//           {/* Email */}
//           <TextField
//             fullWidth
//             label="Email"
//             {...register("email")}
//             error={!!errors.email}
//             helperText={errors.email?.message}
//           />

//           {/* Password */}
//           {!isEditMode && (
//             <TextField
//               fullWidth
//               type="password"
//               label="Password"
//               {...register("password")}
//               error={!!errors.password}
//               helperText={errors.password?.message}
//             />
//           )}

//           {/* Role */}
//           <TextField
//             select
//             fullWidth
//             label="Role"
//             {...register("roleId")}
//             error={!!errors.roleId}
//             helperText={errors.roleId?.message}
//           >
//             <MenuItem value={1}>Admin</MenuItem>
//             <MenuItem value={2}>Manager</MenuItem>
//             <MenuItem value={3}>User</MenuItem>
//           </TextField>

//           {/* Status */}
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   defaultChecked
//                   {...register("isActive")}
//                   onChange={(e) => setValue("isActive", e.target.checked)}
//                 />
//               }
//               label="Active"
//             />
//           </Grid>

//           {/* Buttons */}

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : isEditMode ? (
//               "Update User"
//             ) : (
//               "Create User"
//             )}
//           </Button>

//           <Button variant="outlined" onClick={() => navigate("/users")}>
//             Cancel
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default UserForm;

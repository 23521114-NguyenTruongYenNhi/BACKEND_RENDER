{
  "openapi": "3.0.0",
  "info": {
    "title": "Mystère Meal API",
    "version": "1.0.0",
    "description": "RESTful API for the Mystère Meal recipe recommendation application. This API enables users to discover recipes based on available ingredients, manage personal favorites, submit new recipes, and interact with a community-driven platform featuring ratings, comments, and nutritional information.",
    "contact": {
      "name": "Mystère Meal Development Team",
      "email": "support@mysteremeal.com"
    },
    "license": {
      "name": "MIT License",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "servers": [
    {
      "url": "http://localhost:5000/api",
      "description": "Local development server"
    },
    {
      "url": "https://mystere-meal-api.onrender.com/api",
      "description": "Production server"
    }
  ],
  "tags": [
    {
      "name": "Authentication",
      "description": "User registration and login endpoints. Provides JWT token-based authentication for accessing protected resources."
    },
    {
      "name": "Recipes",
      "description": "Recipe management endpoints. Allows users to browse, search, create, update, and delete recipes. Includes ingredient-based search with multiple filters."
    },
    {
      "name": "User Profile",
      "description": "User profile management endpoints. Handles user favorites and personal recipe collections."
    },
    {
      "name": "Admin",
      "description": "Administrative endpoints. Requires admin role for access. Manages recipe moderation and user account administration."
    },
    {
      "name": "Ingredient Nutrition",
      "description": "Nutritional information management. Provides nutritional data for ingredients and automatic recipe nutrition calculation."
    },
    {
      "name": "Shopping List",
      "description": "Shopping list management. Enables users to create and manage personal shopping lists with items from recipes."
    }
  ],
  "paths": {
    "/users/signup": {
      "post": {
        "tags": ["Authentication"],
        "summary": "Register a new user account",
        "description": "Creates a new user account with email and password. Passwords are hashed using bcrypt before storage. Returns a JWT token for immediate authentication after successful registration.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "password"],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "User's full name",
                    "minLength": 2,
                    "example": "John Smith"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "User's email address (must be unique)",
                    "example": "john.smith@example.com"
                  },
                  "password": {
                    "type": "string",
                    "description": "User's password (minimum 6 characters)",
                    "minLength": 6,
                    "example": "securePassword123"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User successfully registered",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "JWT authentication token (valid for 30 days)"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Email already exists or validation error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/users/login": {
      "post": {
        "tags": ["Authentication"],
        "summary": "User login",
        "description": "Authenticates a user with email and password. Returns a JWT token upon successful authentication. The token must be included in the Authorization header for protected endpoints.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "password"],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "Registered email address",
                    "example": "admin@test.com"
                  },
                  "password": {
                    "type": "string",
                    "description": "Account password",
                    "example": "admin123"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "JWT authentication token"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Invalid email or password",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden - Account has been locked by administrator",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },
    "/recipes/search": {
      "get": {
        "tags": ["Recipes"],
        "summary": "Search recipes by ingredients and filters",
        "description": "Advanced recipe search supporting multiple filters including ingredients, cuisine type, meal type, dietary restrictions, cooking time, and difficulty level. Results are sorted by number of matching ingredients when ingredient search is used.",
        "parameters": [
          {
            "name": "ingredients",
            "in": "query",
            "description": "Comma-separated list of ingredients (case-insensitive partial matching)",
            "schema": {
              "type": "string",
              "example": "chicken,tomato,garlic"
            }
          },
          {
            "name": "cuisine",
            "in": "query",
            "description": "Cuisine type filter",
            "schema": {
              "type": "string",
              "example": "Italian"
            }
          },
          {
            "name": "mealType",
            "in": "query",
            "description": "Meal type filter",
            "schema": {
              "type": "string",
              "enum": ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
              "example": "Dinner"
            }
          },
          {
            "name": "difficulty",
            "in": "query",
            "description": "Cooking difficulty level",
            "schema": {
              "type": "string",
              "enum": ["Easy", "Medium", "Hard"],
              "example": "Medium"
            }
          },
          {
            "name": "maxTime",
            "in": "query",
            "description": "Maximum cooking time in minutes",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "example": 60
            }
          },
          {
            "name": "minRating",
            "in": "query",
            "description": "Minimum average rating (1-5 stars)",
            "schema": {
              "type": "number",
              "minimum": 1,
              "maximum": 5,
              "example": 4.0
            }
          },
          {
            "name": "isVegetarian",
            "in": "query",
            "description": "Filter for vegetarian recipes only",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "isVegan",
            "in": "query",
            "description": "Filter for vegan recipes only",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "isGlutenFree",
            "in": "query",
            "description": "Filter for gluten-free recipes only",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Search results (sorted by ingredient matches if ingredient query provided)",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Recipe"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/recipes/{id}": {
      "get": {
        "tags": ["Recipes"],
        "summary": "Get recipe details by ID",
        "description": "Retrieves complete recipe information including ingredients, steps, nutrition facts, comments, and ratings. Recipe must have 'approved' status to be visible to non-admin users.",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier (MongoDB ObjectId)",
            "schema": {
              "type": "string",
              "example": "507f1f77bcf86cd799439011"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe details retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RecipeDetailed"
                }
              }
            }
          },
          "404": {
            "description": "Recipe not found or not approved",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": ["Recipes"],
        "summary": "Update recipe",
        "description": "Updates recipe information. Only the recipe author can update their own recipes. Admin users can update any recipe.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecipeInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Recipe updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Recipe"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "403": {
            "description": "Forbidden - Not the recipe owner or admin"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      },
      "delete": {
        "tags": ["Recipes"],
        "summary": "Delete recipe",
        "description": "Permanently deletes a recipe. Only the recipe author can delete their own recipes. Admin users can delete any recipe.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Recipe deleted successfully"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "403": {
            "description": "Forbidden - Not the recipe owner or admin"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/recipes": {
      "post": {
        "tags": ["Recipes"],
        "summary": "Create new recipe",
        "description": "Creates a new recipe. Requires authentication. New recipes are set to 'pending' status by default and require admin approval before being publicly visible.",
        "security": [{"BearerAuth": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RecipeInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Recipe created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Recipe"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Validation error"
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          }
        }
      }
    },
    "/recipes/{id}/comments": {
      "post": {
        "tags": ["Recipes"],
        "summary": "Add comment and rating to recipe",
        "description": "Adds a user comment and rating (1-5 stars) to a recipe. The recipe's average rating is automatically recalculated after each comment. Requires authentication.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["text", "rating"],
                "properties": {
                  "text": {
                    "type": "string",
                    "description": "Comment text (minimum 5 characters)",
                    "minLength": 5,
                    "example": "This recipe is absolutely delicious! Easy to follow and tastes amazing."
                  },
                  "rating": {
                    "type": "integer",
                    "description": "Rating from 1 (worst) to 5 (best) stars",
                    "minimum": 1,
                    "maximum": 5,
                    "example": 5
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Comment added successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Comment"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Validation error"
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/users/{id}/favorites": {
      "get": {
        "tags": ["User Profile"],
        "summary": "Get user's favorite recipes",
        "description": "Retrieves all recipes marked as favorites by the user. Requires authentication. Users can only access their own favorites.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of favorite recipes",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Recipe"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "403": {
            "description": "Forbidden - Cannot access other user's favorites"
          }
        }
      },
      "post": {
        "tags": ["User Profile"],
        "summary": "Add recipe to favorites",
        "description": "Adds a recipe to the user's favorites list. Requires authentication. Users can only modify their own favorites.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["recipeId"],
                "properties": {
                  "recipeId": {
                    "type": "string",
                    "description": "Recipe ID to add to favorites",
                    "example": "507f1f77bcf86cd799439011"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Recipe added to favorites successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Recipe added to favorites"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Recipe already in favorites"
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/users/{id}/favorites/{recipeId}": {
      "delete": {
        "tags": ["User Profile"],
        "summary": "Remove recipe from favorites",
        "description": "Removes a recipe from the user's favorites list. Requires authentication.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "recipeId",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe removed from favorites successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Recipe removed from favorites"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Recipe not found in favorites"
          }
        }
      }
    },
    "/users/{id}/recipes": {
      "get": {
        "tags": ["User Profile"],
        "summary": "Get recipes created by user",
        "description": "Retrieves all recipes created by a specific user. Requires authentication.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of user's created recipes",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Recipe"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/admin/recipes": {
      "get": {
        "tags": ["Admin"],
        "summary": "Get recipes by approval status",
        "description": "Retrieves recipes filtered by approval status (pending, approved, rejected). Requires admin role. Used for recipe moderation workflow.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "description": "Recipe approval status filter",
            "schema": {
              "type": "string",
              "enum": ["pending", "approved", "rejected"],
              "default": "pending"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "List of recipes with specified status",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Recipe"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          }
        }
      }
    },
    "/admin/recipes/{id}/approve": {
      "post": {
        "tags": ["Admin"],
        "summary": "Approve pending recipe",
        "description": "Approves a pending recipe, making it publicly visible. Requires admin role.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe approved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Recipe"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/admin/recipes/{id}/reject": {
      "post": {
        "tags": ["Admin"],
        "summary": "Reject pending recipe",
        "description": "Rejects a pending recipe, preventing it from being publicly visible. Requires admin role.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe rejected successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Recipe"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/admin/recipes/{id}": {
      "delete": {
        "tags": ["Admin"],
        "summary": "Delete recipe (admin)",
        "description": "Permanently deletes any recipe regardless of owner. Requires admin role. Use with caution.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Recipe unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Recipe deleted successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Recipe deleted successfully"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    },
    "/admin/users": {
      "get": {
        "tags": ["Admin"],
        "summary": "Get all users",
        "description": "Retrieves a list of all registered users. Requires admin role. Used for user management and moderation.",
        "security": [{"BearerAuth": []}],
        "responses": {
          "200": {
            "description": "List of all users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          }
        }
      }
    },
    "/admin/users/{id}/lock": {
      "post": {
        "tags": ["Admin"],
        "summary": "Lock user account",
        "description": "Locks a user account, preventing login and access to protected resources. Requires admin role. Used for user moderation.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User account locked successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User account locked successfully"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          },
          "404": {
            "description": "User not found"
          }
        }
      }
    },
    "/admin/users/{id}/unlock": {
      "post": {
        "tags": ["Admin"],
        "summary": "Unlock user account",
        "description": "Unlocks a previously locked user account, restoring login and access privileges. Requires admin role.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "User unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User account unlocked successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User account unlocked successfully"
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden - Admin role required"
          },
          "404": {
            "description": "User not found"
          }
        }
      }
    },
    "/ingredients/nutrition": {
      "get": {
        "tags": ["Ingredient Nutrition"],
        "summary": "Get all ingredient nutritional data",
        "description": "Retrieves complete nutritional information for all ingredients in the database. Contains 70+ common ingredients with calories, protein, fat, and carbohydrates per standard unit.",
        "responses": {
          "200": {
            "description": "List of ingredient nutritional data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/IngredientNutrition"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Ingredient Nutrition"],
        "summary": "Add new ingredient nutrition data",
        "description": "Creates a new ingredient nutritional entry. Requires authentication. Used for expanding the nutrition database.",
        "security": [{"BearerAuth": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/IngredientNutritionInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Ingredient nutrition data created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/IngredientNutrition"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Ingredient already exists or validation error"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/ingredients/nutrition/calculate": {
      "post": {
        "tags": ["Ingredient Nutrition"],
        "summary": "Calculate total nutrition for recipe",
        "description": "Calculates the total nutritional value (calories, protein, fat, carbs) for a recipe based on its ingredients and quantities. Automatically matches ingredient names and applies quantity conversions.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["ingredients"],
                "properties": {
                  "ingredients": {
                    "type": "array",
                    "description": "List of recipe ingredients with quantities",
                    "items": {
                      "type": "object",
                      "required": ["name", "quantity", "unit"],
                      "properties": {
                        "name": {
                          "type": "string",
                          "example": "chicken breast"
                        },
                        "quantity": {
                          "type": "number",
                          "example": 200
                        },
                        "unit": {
                          "type": "string",
                          "example": "g"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Nutrition calculation completed",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "totalNutrition": {
                      "type": "object",
                      "properties": {
                        "calories": {
                          "type": "number",
                          "example": 650.5
                        },
                        "protein": {
                          "type": "number",
                          "example": 45.2
                        },
                        "fat": {
                          "type": "number",
                          "example": 20.1
                        },
                        "carbs": {
                          "type": "number",
                          "example": 75.8
                        }
                      }
                    },
                    "ingredientBreakdown": {
                      "type": "array",
                      "description": "Nutritional breakdown per ingredient",
                      "items": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Invalid ingredient data"
          }
        }
      }
    },
    "/shopping-list": {
      "get": {
        "tags": ["Shopping List"],
        "summary": "Get user's shopping list",
        "description": "Retrieves the authenticated user's shopping list with all items. Each user has one shopping list that persists across sessions.",
        "security": [{"BearerAuth": []}],
        "responses": {
          "200": {
            "description": "Shopping list retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Authentication required"
          },
          "404": {
            "description": "Shopping list not found (will be created on first item addition)"
          }
        }
      }
    },
    "/shopping-list/items": {
      "post": {
        "tags": ["Shopping List"],
        "summary": "Add item to shopping list",
        "description": "Adds a new item to the user's shopping list. Items can be added manually or linked to recipes for tracking ingredient sources.",
        "security": [{"BearerAuth": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "quantity", "unit"],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Item name",
                    "example": "Tomatoes"
                  },
                  "quantity": {
                    "type": "number",
                    "description": "Item quantity",
                    "example": 3
                  },
                  "unit": {
                    "type": "string",
                    "description": "Unit of measurement",
                    "example": "pcs"
                  },
                  "recipeId": {
                    "type": "string",
                    "description": "Optional: Link item to recipe",
                    "example": "507f1f77bcf86cd799439011"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Item added to shopping list successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - Validation error"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/shopping-list/items/{itemId}": {
      "delete": {
        "tags": ["Shopping List"],
        "summary": "Remove item from shopping list",
        "description": "Removes a specific item from the user's shopping list by item ID.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "itemId",
            "in": "path",
            "required": true,
            "description": "Shopping list item unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Item removed successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Item not found"
          }
        }
      }
    },
    "/shopping-list/items/{itemId}/toggle": {
      "patch": {
        "tags": ["Shopping List"],
        "summary": "Toggle item checked status",
        "description": "Toggles the checked/unchecked status of a shopping list item. Used to mark items as purchased or needed.",
        "security": [{"BearerAuth": []}],
        "parameters": [
          {
            "name": "itemId",
            "in": "path",
            "required": true,
            "description": "Shopping list item unique identifier",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Item status toggled successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Item not found"
          }
        }
      }
    },
    "/shopping-list/clear-completed": {
      "delete": {
        "tags": ["Shopping List"],
        "summary": "Clear all checked items",
        "description": "Removes all checked/completed items from the shopping list. Useful for clearing purchased items after shopping.",
        "security": [{"BearerAuth": []}],
        "responses": {
          "200": {
            "description": "Completed items cleared successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/shopping-list/add-from-recipe": {
      "post": {
        "tags": ["Shopping List"],
        "summary": "Add recipe ingredients to shopping list",
        "description": "Automatically adds all missing ingredients from a recipe to the user's shopping list. Useful for meal planning and shopping preparation.",
        "security": [{"BearerAuth": []}],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["recipeId"],
                "properties": {
                  "recipeId": {
                    "type": "string",
                    "description": "Recipe unique identifier",
                    "example": "507f1f77bcf86cd799439011"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Recipe ingredients added to shopping list successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ShoppingList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Recipe not found"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "JWT authentication token obtained from /users/login or /users/signup endpoints. Include in Authorization header as 'Bearer <token>'"
      }
    },
    "schemas": {
      "User": {
        "type": "object",
        "description": "User account information (password hash excluded from responses)",
        "properties": {
          "_id": {
            "type": "string",
            "description": "User unique identifier (MongoDB ObjectId)",
            "example": "507f1f77bcf86cd799439011"
          },
          "name": {
            "type": "string",
            "description": "User's full name",
            "example": "John Smith"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "User's email address (unique)",
            "example": "john.smith@example.com"
          },
          "isAdmin": {
            "type": "boolean",
            "description": "Admin role flag (grants access to admin endpoints)",
            "example": false
          },
          "isLocked": {
            "type": "boolean",
            "description": "Account locked status (locked users cannot login)",
            "example": false
          },
          "favorites": {
            "type": "array",
            "description": "Array of favorite recipe IDs",
            "items": {
              "type": "string"
            }
          },
          "createdRecipes": {
            "type": "array",
            "description": "Array of recipe IDs created by this user",
            "items": {
              "type": "string"
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Account creation timestamp",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "Recipe": {
        "type": "object",
        "description": "Recipe information with basic details",
        "properties": {
          "_id": {
            "type": "string",
            "description": "Recipe unique identifier",
            "example": "507f1f77bcf86cd799439011"
          },
          "title": {
            "type": "string",
            "description": "Recipe title",
            "example": "Spaghetti Carbonara"
          },
          "description": {
            "type": "string",
            "description": "Brief recipe description",
            "example": "Classic Italian pasta dish with eggs, cheese, and bacon"
          },
          "image": {
            "type": "string",
            "format": "uri",
            "description": "Recipe image URL (Unsplash or uploaded)",
            "example": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800"
          },
          "cuisine": {
            "type": "string",
            "description": "Cuisine type (e.g., Italian, Chinese, Mexican)",
            "example": "Italian"
          },
          "mealType": {
            "type": "string",
            "description": "Meal type category",
            "enum": ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
            "example": "Dinner"
          },
          "difficulty": {
            "type": "string",
            "description": "Cooking difficulty level",
            "enum": ["Easy", "Medium", "Hard"],
            "example": "Medium"
          },
          "time": {
            "type": "integer",
            "description": "Total cooking time in minutes",
            "example": 30,
            "minimum": 1
          },
          "servings": {
            "type": "integer",
            "description": "Number of servings",
            "example": 4,
            "minimum": 1
          },
          "ingredients": {
            "type": "array",
            "description": "List of ingredients with quantities",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Ingredient name",
                  "example": "spaghetti"
                },
                "quantity": {
                  "type": "number",
                  "description": "Ingredient quantity",
                  "example": 400
                },
                "unit": {
                  "type": "string",
                  "description": "Unit of measurement (g, kg, ml, l, pcs, tbsp, tsp, cups)",
                  "example": "g"
                }
              }
            }
          },
          "steps": {
            "type": "array",
            "description": "Cooking instructions (ordered steps)",
            "items": {
              "type": "string"
            },
            "example": ["Boil pasta in salted water", "Cook bacon until crispy", "Mix eggs with cheese", "Combine all ingredients"]
          },
          "tags": {
            "type": "array",
            "description": "Recipe tags for categorization",
            "items": {
              "type": "string"
            },
            "example": ["comfort-food", "quick-meal", "family-friendly"]
          },
          "isVegetarian": {
            "type": "boolean",
            "description": "Vegetarian recipe flag",
            "example": false
          },
          "isVegan": {
            "type": "boolean",
            "description": "Vegan recipe flag",
            "example": false
          },
          "isGlutenFree": {
            "type": "boolean",
            "description": "Gluten-free recipe flag",
            "example": false
          },
          "countryTag": {
            "type": "string",
            "description": "Country or region tag for grouping related recipes",
            "example": "Italy"
          },
          "nutrition": {
            "type": "object",
            "description": "Nutritional information per serving",
            "properties": {
              "calories": {
                "type": "number",
                "description": "Calories (kcal)",
                "example": 650
              },
              "protein": {
                "type": "number",
                "description": "Protein (g)",
                "example": 25
              },
              "fat": {
                "type": "number",
                "description": "Fat (g)",
                "example": 20
              },
              "carbs": {
                "type": "number",
                "description": "Carbohydrates (g)",
                "example": 85
              }
            }
          },
          "status": {
            "type": "string",
            "description": "Recipe approval status (admin moderation)",
            "enum": ["pending", "approved", "rejected"],
            "example": "approved"
          },
          "author": {
            "type": "string",
            "description": "User ID of recipe creator",
            "example": "507f1f77bcf86cd799439011"
          },
          "rating": {
            "type": "number",
            "description": "Average user rating (1-5 stars, calculated from comments)",
            "minimum": 1,
            "maximum": 5,
            "example": 4.5
          },
          "comments": {
            "type": "array",
            "description": "Array of comment IDs",
            "items": {
              "type": "string"
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Recipe creation timestamp",
            "example": "2024-01-15T10:30:00.000Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Last update timestamp",
            "example": "2024-01-20T14:45:00.000Z"
          }
        }
      },
      "RecipeDetailed": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Recipe"
          },
          {
            "type": "object",
            "description": "Extended recipe information with populated comments",
            "properties": {
              "comments": {
                "type": "array",
                "description": "Full comment objects (populated)",
                "items": {
                  "$ref": "#/components/schemas/Comment"
                }
              }
            }
          }
        ]
      },
      "RecipeInput": {
        "type": "object",
        "description": "Recipe creation/update input schema",
        "required": ["title", "cuisine", "mealType", "difficulty", "time", "ingredients", "steps"],
        "properties": {
          "title": {
            "type": "string",
            "description": "Recipe title (minimum 3 characters)",
            "minLength": 3,
            "example": "Spaghetti Carbonara"
          },
          "description": {
            "type": "string",
            "description": "Recipe description",
            "example": "Classic Italian pasta with creamy egg and cheese sauce"
          },
          "image": {
            "type": "string",
            "format": "uri",
            "description": "Recipe image URL",
            "example": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800"
          },
          "cuisine": {
            "type": "string",
            "description": "Cuisine type",
            "example": "Italian"
          },
          "mealType": {
            "type": "string",
            "enum": ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
            "example": "Dinner"
          },
          "difficulty": {
            "type": "string",
            "enum": ["Easy", "Medium", "Hard"],
            "example": "Medium"
          },
          "time": {
            "type": "integer",
            "description": "Cooking time in minutes",
            "minimum": 1,
            "example": 30
          },
          "servings": {
            "type": "integer",
            "description": "Number of servings",
            "minimum": 1,
            "example": 4
          },
          "ingredients": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["name", "quantity", "unit"],
              "properties": {
                "name": {
                  "type": "string",
                  "example": "spaghetti"
                },
                "quantity": {
                  "type": "number",
                  "minimum": 0,
                  "example": 400
                },
                "unit": {
                  "type": "string",
                  "example": "g"
                }
              }
            }
          },
          "steps": {
            "type": "array",
            "description": "Cooking steps",
            "minItems": 1,
            "items": {
              "type": "string",
              "minLength": 10
            },
            "example": ["Boil pasta in salted water for 8-10 minutes", "Cook bacon until crispy", "Mix eggs with grated cheese", "Combine all ingredients and serve hot"]
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": ["comfort-food", "quick"]
          },
          "isVegetarian": {
            "type": "boolean",
            "example": false
          },
          "isVegan": {
            "type": "boolean",
            "example": false
          },
          "isGlutenFree": {
            "type": "boolean",
            "example": false
          },
          "countryTag": {
            "type": "string",
            "example": "Italy"
          },
          "nutrition": {
            "type": "object",
            "properties": {
              "calories": {
                "type": "number",
                "example": 650
              },
              "protein": {
                "type": "number",
                "example": 25
              },
              "fat": {
                "type": "number",
                "example": 20
              },
              "carbs": {
                "type": "number",
                "example": 85
              }
            }
          }
        }
      },
      "Comment": {
        "type": "object",
        "description": "User comment and rating on a recipe",
        "properties": {
          "_id": {
            "type": "string",
            "description": "Comment unique identifier",
            "example": "507f1f77bcf86cd799439011"
          },
          "user": {
            "type": "string",
            "description": "User ID who posted the comment",
            "example": "507f1f77bcf86cd799439011"
          },
          "recipe": {
            "type": "string",
            "description": "Recipe ID this comment belongs to",
            "example": "507f1f77bcf86cd799439011"
          },
          "text": {
            "type": "string",
            "description": "Comment text content",
            "example": "This recipe is absolutely delicious! The sauce came out perfectly creamy."
          },
          "rating": {
            "type": "integer",
            "description": "User rating (1-5 stars)",
            "minimum": 1,
            "maximum": 5,
            "example": 5
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Comment creation timestamp",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "IngredientNutrition": {
        "type": "object",
        "description": "Nutritional information for a single ingredient",
        "properties": {
          "_id": {
            "type": "string",
            "description": "Ingredient nutrition entry unique identifier",
            "example": "507f1f77bcf86cd799439011"
          },
          "name": {
            "type": "string",
            "description": "Ingredient name (unique, lowercase)",
            "example": "chicken breast"
          },
          "caloriesPerUnit": {
            "type": "number",
            "description": "Calories per standard unit (kcal)",
            "example": 165
          },
          "proteinPerUnit": {
            "type": "number",
            "description": "Protein per standard unit (g)",
            "example": 31
          },
          "fatPerUnit": {
            "type": "number",
            "description": "Fat per standard unit (g)",
            "example": 3.6
          },
          "carbsPerUnit": {
            "type": "number",
            "description": "Carbohydrates per standard unit (g)",
            "example": 0
          },
          "standardUnit": {
            "type": "string",
            "description": "Standard measurement unit (typically 100g)",
            "default": "100g",
            "example": "100g"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Entry creation timestamp"
          }
        }
      },
      "IngredientNutritionInput": {
        "type": "object",
        "description": "Input schema for creating ingredient nutrition data",
        "required": ["name", "caloriesPerUnit", "proteinPerUnit", "fatPerUnit", "carbsPerUnit"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Ingredient name (must be unique)",
            "example": "chicken breast"
          },
          "caloriesPerUnit": {
            "type": "number",
            "minimum": 0,
            "example": 165
          },
          "proteinPerUnit": {
            "type": "number",
            "minimum": 0,
            "example": 31
          },
          "fatPerUnit": {
            "type": "number",
            "minimum": 0,
            "example": 3.6
          },
          "carbsPerUnit": {
            "type": "number",
            "minimum": 0,
            "example": 0
          },
          "standardUnit": {
            "type": "string",
            "description": "Standard unit (defaults to 100g if not provided)",
            "default": "100g",
            "example": "100g"
          }
        }
      },
      "ShoppingList": {
        "type": "object",
        "description": "User's shopping list with items",
        "properties": {
          "_id": {
            "type": "string",
            "description": "Shopping list unique identifier",
            "example": "507f1f77bcf86cd799439011"
          },
          "user": {
            "type": "string",
            "description": "User ID who owns this shopping list",
            "example": "507f1f77bcf86cd799439011"
          },
          "items": {
            "type": "array",
            "description": "List of shopping items",
            "items": {
              "type": "object",
              "properties": {
                "_id": {
                  "type": "string",
                  "description": "Item unique identifier",
                  "example": "507f1f77bcf86cd799439011"
                },
                "name": {
                  "type": "string",
                  "description": "Item name",
                  "example": "Tomatoes"
                },
                "quantity": {
                  "type": "number",
                  "description": "Item quantity",
                  "example": 3
                },
                "unit": {
                  "type": "string",
                  "description": "Unit of measurement",
                  "example": "pcs"
                },
                "checked": {
                  "type": "boolean",
                  "description": "Item checked/completed status",
                  "default": false,
                  "example": false
                },
                "recipeId": {
                  "type": "string",
                  "description": "Optional: Recipe this item is linked to",
                  "example": "507f1f77bcf86cd799439011"
                }
              }
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Shopping list creation timestamp"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Last update timestamp"
          }
        }
      },
      "Error": {
        "type": "object",
        "description": "Standard error response format",
        "properties": {
          "message": {
            "type": "string",
            "description": "Error message describing what went wrong",
            "example": "Invalid email or password"
          },
          "error": {
            "type": "string",
            "description": "Error type or code (optional)",
            "example": "AUTHENTICATION_FAILED"
          }
        }
      }
    }
  }
}

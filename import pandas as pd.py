import pandas as pd

# Default values for costs
DISTANCE_COST_PER_KM = 10
FIXED_SHIPPING_COST = 116
BONUS_FOR_DELAY = 72

def load_data(file_path):
    """Load CSV data and validate its integrity."""
    try:
        data = pd.read_csv(file_path)
        # Basic validation: checking for required columns
        required_columns = ["ID", "Origin", "Destination", "Distance_km", "Estimated_Time", "Weather_Condition", "Route_Condition"]
        if not all(col in data.columns for col in required_columns):
            print("Error: CSV file does not contain all required columns.")
            return None
        if data.empty:
            print("Error: CSV file is empty.")
            return None
        print("Data loaded and validated successfully.")
        return data
    except Exception as e:
        print(f"Error loading file: {e}")
        return None

def calculate_costs(data):
    """Calculate the cost for each shipment based on route conditions."""
    costs = []
    for _, row in data.iterrows():
        distance_cost = row["Distance_km"] * DISTANCE_COST_PER_KM
        condition_multiplier = 1 + (row["Route_Condition"] - 1) * 0.2
        if row["Route_Condition"] == 5:
            # Route blocked, apply delay bonus, and set cost to zero
            cost = BONUS_FOR_DELAY
            print(f"Shipment {row['ID']} is delayed; bonus applied.")
        else:
            # Calculate based on distance, fixed cost, and condition
            cost = distance_cost * condition_multiplier + FIXED_SHIPPING_COST
        costs.append(cost)
    data["Calculated_Cost"] = costs
    return data

def summarize_daily_costs(data):
    """Generate a summary of daily shipping costs."""
    total_cost = data["Calculated_Cost"].sum()
    print("\n--- Daily Cost Summary ---")
    print(data[["ID", "Origin", "Destination", "Distance_km", "Weather_Condition", "Route_Condition", "Calculated_Cost"]])
    print(f"\nTotal Daily Shipping Cost: ${total_cost:.2f}")

def main_menu():
    """Interactive menu for user options."""
    while True:
        print("\n--- Shipping Cost Calculator ---")
        print("1. Load and Verify Data")
        print("2. Calculate Daily Shipping Costs")
        print("3. Exit")
        choice = input("Choose an option: ")
        
        if choice == "1":
            file_path = input("Enter the path to the CSV file: ")
            data = load_data(file_path)
            if data is not None:
                print("Data is ready for processing.")
        elif choice == "2":
            if 'data' in locals() and data is not None:
                data = calculate_costs(data)
                summarize_daily_costs(data)
            else:
                print("Please load and verify data first.")
        elif choice == "3":
            print("Exiting program. Goodbye!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

# Run the program
if __name__ == "__main__":
    main_menu()
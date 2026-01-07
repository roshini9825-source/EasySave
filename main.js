/**
 * Main Database Management Interface
 * Handles CRUD operations for data blocks with real-time UI updates
 */

// Retrieve authentication credentials from cookies
const username = getCookie("username");
const auth = getCookie("auth");

// Array to store block data (currently unused but reserved for future features)
var blocks = [];

// Base height for textareas in pixels - used for auto-resize calculations
var baseHeight = 30;

// Flag to prevent multiple empty "new entry" rows from being created
var emptyRowActive = false;

document.addEventListener("DOMContentLoaded", () => {
  // Display the logged-in username in the header
  document.getElementById("username").innerText = username

  // Authentication check - redirect to login if not authenticated
  if (!getCookie("auth")) {
    window.location.href = "/login";
  }

  // Refresh button handler - reloads all data with visual feedback
  document.getElementById("refreshIcon").addEventListener("click", async function(e) {
    e.target.classList.add("spin")  // Add spinning animation
    refreshTable()  // Fetch and render fresh data
    await sleep(1000)  // Keep animation visible for 1 second
    e.target.classList.remove("spin")  // Remove animation
  });

  // Logout button handler - clears session and returns to login
  document.getElementById("logoutIcon").addEventListener("click", function(e) {
    // Clear authentication cookies by setting expiration to past date
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  })


  // Initial data load when page is ready
  refreshTable()
});

/**
 * Retrieves a cookie value by name
 * @param {string} cname - The name of the cookie to retrieve
 * @returns {string} The cookie value, or empty string if not found
 */
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  // Iterate through all cookies
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    // Remove leading whitespace
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    // Check if this cookie matches the requested name
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Generic API request handler with authentication
 * @param {string} method - HTTP method (GET, POST, PATCH)
 * @param {string} endpoint - API endpoint path (e.g., "get_blocks")
 * @param {Object} data - Key-value pairs for query parameters
 * @param {Function} callback - Callback function(error, response)
 */
function sendRequest(method, endpoint, data, callback) {
  var fullUrl = "http://63.179.18.244/api/" + endpoint;
  
  // Build query string from data object
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = encodeURIComponent(data[key]);
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + key + '=' + value;
    }
  }

  const xhr = new XMLHttpRequest();
  xhr.open(method, fullUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // Add authentication headers for all requests
  xhr.setRequestHeader("RequesterUsername", username)
  xhr.setRequestHeader("RequesterAccessKey", auth)
  xhr.responseType = "json";

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;  // Wait for request to complete

    // Check if response status indicates success
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      callback(new Error("Request failed: " + xhr.status), null);
    }
  };

  xhr.send(null);
}

/**
 * Utility function to pause execution
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after ms milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches all data blocks from server and renders them in the table
 * Also sets up event listeners for all interactive elements
 */
function refreshTable() {
  // Try to capture the base height of existing textareas for auto-resize
  try {
    baseHeight = document.getElementsByTagName("textarea")[0].scrollHeight;
  } catch (error) {
    // Ignore if no textareas exist yet
  }

  // Reset flag to allow new entry row creation
  emptyRowActive = false

  // Clear existing table content
  table = document.getElementsByClassName("main-table")[0]
  table.innerText = ""

  // Add column headers from template
  table.appendChild(document.getElementById("titlesTemplate").content.cloneNode(true));

  // Fetch all blocks from the server (empty identifier returns all)
  sendRequest("GET", "get_blocks", {"extendedIdentifier": ""}, function(error, response) {
    if (response != null) {
      response.blockList.forEach(function(value) {
        // Remove system prefix and username from identifier (keep only user-defined name)
        // e.g., "system.username.myblock" -> "myblock"
        trimmedIdentifier = value.identifier.split(".").slice(2).join(".")
        newValue = value.value
        
        newTableRow = document.createElement("tr")


        // First column: Identifier (read-only for existing blocks)
        tableEntryOne = document.createElement("td")
        newInput = document.createElement("input")
        newInput.type = "text"
        newInput.value = trimmedIdentifier
        newInput.disabled = true  // Existing identifiers cannot be changed

        tableEntryOne.appendChild(newInput)
        newTableRow.appendChild(tableEntryOne)


        // Second column: Value (editable textarea with auto-resize)
        tableEntryTwo = document.createElement("td")
        textArea = document.createElement("textarea")
        textArea.value = newValue

        // Auto-resize textarea as content changes
        textArea.addEventListener("input", () => {
          textArea.style.height = baseHeight - 6 + "px";   // Reset to single row
          textArea.style.height = textArea.scrollHeight - 6 + "px"  // Expand to fit content
        });

        tableEntryTwo.appendChild(textArea)
        newTableRow.appendChild(tableEntryTwo)


        // Third column: Save icon (updates existing block)
        tableEntryThree = document.createElement("td")
        saveIcon = document.createElement("i")
        saveIcon.classList = "fa-solid fa-floppy-disk fa-xl save-icon"

        // Save button handler - updates block value on server
        saveIcon.addEventListener("click", function(e) {
          // Navigate DOM to get identifier and value from the same row
          identifier = e.target.parentElement.parentElement.children[0].children[0].value
          value = e.target.parentElement.parentElement.children[1].children[0].value
          saveValue(e.target, identifier, value)
          e.target.classList.remove("pulse")
        });

        // Add hover effect animations
        saveIcon.addEventListener("mouseover", function(e) {
          e.target.classList.add("pulse")
        });

        saveIcon.addEventListener("mouseleave", function(e) {
          e.target.classList.remove("pulse")
        });

        tableEntryThree.appendChild(saveIcon)
        newTableRow.appendChild(tableEntryThree)


        // Fourth column: Delete icon (removes block from database)
        tableEntryFour = document.createElement("td")
        trashIcon = document.createElement("i")
        trashIcon.classList = "fa-solid fa-trash fa-lg save-icon"

        // Delete button handler - removes block from server and DOM
        trashIcon.addEventListener("click", function(e) {
          identifier = e.target.parentElement.parentElement.children[0].children[0].value
          deleteBlock(e.target, identifier)
          e.target.classList.remove("pulse")
        });

        // Add hover effect animations
        trashIcon.addEventListener("mouseover", function(e) {
          e.target.classList.add("pulse")
        });

        trashIcon.addEventListener("mouseleave", function(e) {
          e.target.classList.remove("pulse")
        });

        tableEntryFour.appendChild(trashIcon)
        newTableRow.appendChild(tableEntryFour)


        // Add the complete row to the table
        table.appendChild(newTableRow)
      });
    }

    // Add "new entry" row at the bottom with a "+" icon
    let temp = document.getElementById("newRowTemplate");
    let clon = temp.content.cloneNode(true);

    // Handler for the "+" icon - creates a new empty row for data entry
    clon.children[0].children[0].addEventListener("click", async function(e) {
      // Get the last data row (second to last, before the + row)
      length = e.target.parentElement.parentElement.parentElement.children.length
      lastRow = e.target.parentElement.parentElement.parentElement.children[length - 2]

      input_0 = lastRow.children[0]
      input_1 = lastRow.children[1]

      // Validation: Check if an empty row already exists and is unfilled
      if (emptyRowActive && input_0.children[0].type == "text") {
        // Show red border to indicate user must fill existing row first
        input_0.style["border"] = "2px solid red"
        input_1.style["border"] = "2px solid red"
        input_0.focus();
        target.style["color"] = "red"
        await sleep(1000)
        input_0.style["color"] = "black"
        input_1.style["color"] = "black"
        return
      } else if (emptyRowActive) {
        return;
      }
      // Set flag to prevent multiple empty rows
      emptyRowActive = true;

      // Create new empty row for data entry
      newTableRow = document.createElement("tr")

      // First column: Editable identifier input
      tableEntryOne = document.createElement("td")
      newInput = document.createElement("input")
      newInput.type = "text"

      // Remove red border when user starts typing
      newInput.addEventListener("input", function(e) {
        e.target.parentElement.style["border"] = "2px solid black"
      });

      tableEntryOne.appendChild(newInput)
      newTableRow.appendChild(tableEntryOne)


      // Second column: Editable value textarea
      tableEntryTwo = document.createElement("td")
      textArea = document.createElement("textarea")

      // Auto-resize textarea as content changes
      textArea.addEventListener("input", () => {
        textArea.style.height = baseHeight - 6 + "px";   // Reset to single row
        textArea.style.height = textArea.scrollHeight - 6 + "px"  // Expand to fit
      });

      // Remove red border when user starts typing
      textArea.addEventListener("input", function(e) {
        e.target.parentElement.style["border"] = "2px solid black"
      });

      tableEntryTwo.appendChild(textArea)
      newTableRow.appendChild(tableEntryTwo)


      // Third column: Save icon (creates new block)
      tableEntryThree = document.createElement("td")
      saveIcon = document.createElement("i")
      saveIcon.classList = "fa-solid fa-floppy-disk fa-xl save-icon"

      // Save handler for new entry - calls createNewValue instead of saveValue
      saveIcon.addEventListener("click", function eventHandler(e) {
        identifier = e.target.parentElement.parentElement.children[0].children[0].value
        value = e.target.parentElement.parentElement.children[1].children[0].value
        // Pass eventHandler reference so it can be removed after successful creation
        createNewValue(e.target, identifier, value, eventHandler)
        e.target.classList.remove("pulse")
      });

      // Hover effect animations
      saveIcon.addEventListener("mouseover", function(e) {
        e.target.classList.add("pulse")
      });

      saveIcon.addEventListener("mouseleave", function(e) {
        e.target.classList.remove("pulse")
      });

      tableEntryThree.appendChild(saveIcon)
      newTableRow.appendChild(tableEntryThree)


      // Fourth column: Delete icon (removes the empty row without API call)
      tableEntryFour = document.createElement("td")
        trashIcon = document.createElement("i")
        trashIcon.classList = "fa-solid fa-trash fa-lg save-icon"
        
        // For new rows, trash icon just removes the row (no API call needed)
        trashIcon.addEventListener("click", deleteEmptyRow)

        tableEntryFour.appendChild(trashIcon)
        newTableRow.appendChild(tableEntryFour)

      // Insert the new row before the "+" row
      table.insertBefore(newTableRow, document.getElementById("newEntryRow"))
    });

    // Append the "+" row to the end of the table
    table.appendChild(clon);

    // Recalculate base height after all textareas are rendered
    baseHeight = document.getElementsByTagName("textarea")[0].scrollHeight;

    // Setup auto-resize for all textareas in the table
    Array.from(document.getElementsByTagName("textarea")).forEach(element => {
      element.addEventListener("input", () => {
        element.style.height = baseHeight - 6 + "px";   // Reset to single row
        element.style.height = element.scrollHeight - 6 + "px"  // Expand to fit
      });
    });
  });

}

/**
 * Updates an existing block's value on the server
 * @param {HTMLElement} target - The save icon element (for visual feedback)
 * @param {string} identifier - The block identifier
 * @param {string} value - The new value to save
 */
function saveValue(target, identifier, value) {
  // Show loading spinner while request is in progress
  target.classList = "fa-solid fa-spinner fa-lg"
  sendRequest("PATCH", "update_block", {"extendedIdentifier": identifier, "value": value}, async function(error, response) { 
    if (error == null) {
      // Success: Show green icon for 1 second
      target.style["color"] = "green"
      target.classList = "fa-solid fa-floppy-disk fa-xl save-icon"
      await sleep(1000)
      target.style["color"] = "black"
    } else {
      // Error: Show red icon for 1 second
      target.style["color"] = "red"
      target.classList = "fa-solid fa-floppy-disk fa-xl save-icon"
      await sleep(1000)
      target.style["color"] = "black"
    }
  });
}

/**
 * Deletes a block from the server and removes its row from the UI
 * @param {HTMLElement} target - The trash icon element
 * @param {string} identifier - The block identifier to delete
 */
function deleteBlock(target, identifier) {
  // Show loading spinner while request is in progress
  target.classList = "fa-solid fa-spinner fa-lg"
  sendRequest("POST", "delete_block", {"extendedIdentifier": identifier}, async function(error, response) { 
    if (error == null) {
      // Success: Immediately remove the row from DOM
      target.parentElement.parentElement.remove()
    } else {
      // Error: Show red icon for 1 second
      target.style["color"] = "red"
      target.classList = "fa-solid fa-trash fa-lg save-icon"
      await sleep(1000)
      target.style["color"] = "black"
    }
  });
}

/**
 * Removes the temporary empty row used for creating new entries
 * @param {Event} eventPointer - The click event object
 */
function deleteEmptyRow(eventPointer) {
  // Remove the row from DOM
  eventPointer.target.parentElement.parentElement.remove()
  // Reset flag to allow creating another new entry
  emptyRowActive = false
}

/**
 * Creates a new block on the server and converts temporary row to permanent
 * @param {HTMLElement} target - The save icon element
 * @param {string} identifier - The new block identifier
 * @param {string} value - The block value
 * @param {Function} e - The original event handler (for removal after creation)
 */
async function createNewValue(target, identifier, value, e) {
  // Validate that identifier is not empty
  if (identifier == "") {
    // Show validation error with red borders
    target.style["color"] = "red"
    target.classList = "fa-solid fa-floppy-disk fa-xl save-icon"
    target.parentElement.parentElement.children[0].style["border"] = "2px solid red"
    target.parentElement.parentElement.children[1].style["border"] = "2px solid black"
    target.parentElement.parentElement.children[0].children[0].focus();
    await sleep(1000)
    target.style["color"] = "black"
    return
  }

  // Show loading spinner and disable identifier input
  target.classList = "fa-solid fa-spinner fa-lg"
  target.parentElement.parentElement.children[0].children[0].disabled = true
  target.parentElement.parentElement.children[0].style["border"] = "2px solid black"

  sendRequest("POST", "create_block", {"extendedIdentifier": identifier, "value": value}, async function(error, response) { 
    if (error == null) {
      // Success: Convert temporary row to permanent row
      target.style["color"] = "green"
      target.classList = "fa-solid fa-floppy-disk fa-xl save-icon"

      // Update trash icon behavior from "delete row" to "delete block from server"
      var trashIcon = target.parentElement.parentElement.children[3].children[0]

      trashIcon.removeEventListener("click", deleteEmptyRow)

      // Add proper delete block handler with hover effects
      trashIcon.addEventListener("click", function(e) {
        identifier = e.target.parentElement.parentElement.children[0].children[0].value
        deleteBlock(e.target, identifier)
        e.target.classList.remove("pulse")
      });

      trashIcon.addEventListener("mouseover", function(e) {
        e.target.classList.add("pulse")
      });

      trashIcon.addEventListener("mouseleave", function(e) {
        e.target.classList.remove("pulse")
      });

      trashIcon.style["cursor"] = "pointer"
      trashIcon.style["color"] = "black"

      // Update save icon behavior from "create" to "update"
      target.removeEventListener("click", e)

      target.addEventListener("click", function(e) {
        identifier = e.target.parentElement.parentElement.children[0].children[0].value
        value = e.target.parentElement.parentElement.children[1].children[0].value
        saveValue(e.target, identifier, value)
        e.target.classList.remove("pulse")
      });

      // Reset flag to allow creating another new entry
      emptyRowActive = false

      // Show green success indicator for 1 second
      await sleep(1000)
      target.style["color"] = "black"
    } else {
      // Error: Show red icon for 1 second
      target.style["color"] = "red"
      target.classList = "fa-solid fa-floppy-disk fa-xl save-icon"
      await sleep(1000)
      target.style["color"] = "black"
    }
  });
}
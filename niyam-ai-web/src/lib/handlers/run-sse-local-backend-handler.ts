/**
 * Local Backend Handler for Run SSE API Route
 *
 * Handles streaming requests for local backend deployment configuration.
 * This handler formats requests for local backend endpoints and processes streaming responses.
 */

import { getEndpointForPath, getAuthHeaders } from "@/lib/config";
import {
  ProcessedStreamRequest,
  formatLocalBackendPayload,
  logStreamStart,
  logStreamResponse,
  SSE_HEADERS,
} from "./run-sse-common";
import {
  createInternalServerError,
  createBackendConnectionError,
  createStreamingError,
} from "./error-utils";

/**
 * Validate that a response is suitable for streaming
 */
function validateStreamingResponse(response: Response): {
  isValid: boolean;
  error?: string;
} {
  if (!response.ok) {
    return {
      isValid: false,
      error: `Backend error: ${response.status} ${response.statusText}`,
    };
  }

  if (!response.body) {
    return {
      isValid: false,
      error: "No response body available for streaming",
    };
  }

  return { isValid: true };
}

/**
 * Handle local backend streaming request
 *
 * @param requestData - Processed request data
 * @returns SSE streaming Response
 */
export async function handleLocalBackendStreamRequest(
  requestData: ProcessedStreamRequest
): Promise<Response> {
  try {
    // Format payload for local backend
    const localBackendPayload = formatLocalBackendPayload(requestData);

    // Build local backend URL with stream endpoint
    const localBackendUrl = `${getEndpointForPath("/run_sse")}`;

    // Log operation start
    logStreamStart(localBackendUrl, localBackendPayload, "local_backend");

    // Debug log
    console.log("➡️  Local backend request prepared:", {
      url: localBackendUrl,
      payload: localBackendPayload,
    });

    // Get authentication headers
    const authHeaders = await getAuthHeaders();
    console.log("🔐 Auth headers obtained for local backend:", authHeaders);

    // Forward request to local backend
    const response = await fetch(localBackendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(localBackendPayload),
    });

    console.log(
      `⬅️  Received response from local backend: ${response.status} ${response.statusText}`
    );

    // Validate response before streaming
    const validation = validateStreamingResponse(response);
    if (!validation.isValid) {
      console.error(`❌ Local backend error: ${validation.error}`);
      console.log("ℹ️  Attempting to read error details from response body...");

      // Try to get error details from response
      let errorDetails = validation.error || "Unknown error";
      try {
        const errorText = await response.text();
        console.error(`❌ Error details:`);
        if (errorText) {
          errorDetails = `${validation.error}. ${errorText}`;
        }
      } catch {
        // If response is already consumed, use original error
        console.log(
          "ℹ️  Could not read response body for error details (already consumed)"
        );
      }

      return createBackendConnectionError(
        "local_backend",
        response.status,
        response.statusText,
        errorDetails
      );
    }

    //  Log successful response
    logStreamResponse(
      response.status,
      response.statusText,
      response.headers,
      "local_backend"
    );

    console.log("✅ Forwarding SSE stream from local backend to client");

    // The local ADK backend produces a valid SSE stream, so we forward it directly
    // without the complex processing needed for Agent Engine.
    return new Response(response.body, {
      status: 200,
      headers: SSE_HEADERS,
    });
  } catch (error) {
    console.error("❌ Local backend handler error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.log("ℹ️  Detected fetch failure when contacting local backend");
      return createBackendConnectionError(
        "local_backend",
        500,
        "Connection failed",
        "Failed to connect to local backend"
      );
    }

    return createStreamingError(
      "local_backend",
      null,
      "Failed to process local backend streaming request"
    );
  }
}

/**
 * Validate local backend configuration
 *
 * @returns Validation result
 */
export function validateLocalBackendConfig(): {
  isValid: boolean;
  error?: string;
} {
  try {
    const endpoint = getEndpointForPath("/stream");
    console.log("🔎 Local backend endpoint from config:", endpoint);
    if (!endpoint) {
      return {
        isValid: false,
        error: "Local backend endpoint not configured",
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Local backend configuration error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

/**
 * Create local backend specific error response
 *
 * @param error - Error message
 * @param details - Additional error details
 * @returns Error Response
 */
export function createLocalBackendError(
  error: string,
  details?: unknown
): Response {
  console.error("❌ Local Backend Error:", error, details);

  return createInternalServerError(
    `Local Backend Error: ${error}`,
    details instanceof Error ? details : new Error(String(details))
  );
}

import { VercelRequest, VercelResponse } from "@vercel/node";
import { VapiPayload, VapiWebhookEnum } from "../../types/vapi.types";
import { assistantRequestHandler } from "./.assistantRequest";
import { endOfCallReportHandler } from "./.endOfCallReport";
import { functionCallHandler } from "./.functionCall";
import { speechUpdateHandler } from "./.speechUpdateHandler";
import { statusUpdateHandler } from "./.statusUpdate";
import { transcriptHandler } from "./.transcript";
import { HangEventHandler } from "./.hang";
import { setCors } from "../../utils/cors.utils";

export default async (req: VercelRequest, res: VercelResponse) => {
  if ((req.method = "POST")) {
    setCors(res);
    const conversationUuid = req.query.conversation_uuid as string;

    if (conversationUuid) {
      // This way we can fetch some data from database and use it in the handlers.
      // Here you can fetch some context which will be shared accorss all the webhook events for this conversation.
      console.log("conversationUuid", conversationUuid);
    }
    try {
      const payload = req.body.message as VapiPayload;
      
      console.log("type", payload.type, payload);

      switch (payload.type) {
        case VapiWebhookEnum.FUNCTION_CALL:
          return res.status(201).json(await functionCallHandler(payload));
        case VapiWebhookEnum.STATUS_UPDATE:
          return res.status(201).json(await statusUpdateHandler(payload));
        case VapiWebhookEnum.ASSISTANT_REQUEST:
          return res.status(201).json(await assistantRequestHandler(payload));
        case VapiWebhookEnum.END_OF_CALL_REPORT:
          return res.status(201).json(await endOfCallReportHandler(payload));
        case VapiWebhookEnum.SPEECH_UPDATE:
          return res.status(201).json(await speechUpdateHandler(payload));
        case VapiWebhookEnum.TRANSCRIPT:
          return res.status(201).json(await transcriptHandler(payload));
        case VapiWebhookEnum.HANG:
          return res.status(201).json(await HangEventHandler(payload));
        default:
          throw new Error(`Unhandled message type`);
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  return res.status(404).send("Not found");
};

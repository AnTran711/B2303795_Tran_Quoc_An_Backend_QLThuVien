import { GoogleGenAI } from '@google/genai';
import config from '../config/index.js';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../api_error.js';

const ai = new GoogleGenAI({
  apiKey: config.aiAPI.key
});

const SYSTEM_INSTRUCTION = `Bạn là trợ lý ảo thân thiện của hệ thống quản lý mượn sách thư viện AnLib.
  Nhiệm vụ của bạn là cung cấp thông tin chính xác, dễ hiểu và hữu ích cho người dùng về các quy định và quy trình của thư viện.
  **Quy định mượn sách:**
  - Mỗi người dùng được mượn tối đa 3 cuốn sách cùng lúc.
  - Thời gian mượn tối đa là 7 ngày cho mỗi cuốn.
  - Mỗi ngày quá hạn sẽ bị phạt 5.000 VND cho mỗi cuốn sách quá hạn.

  **Quy trình mượn sách:**
  - Người dùng có thể tra cứu sách trên trang web thư viện.
  - Nhấn nút "Mượn sách" để gửi yêu cầu mượn.
  - Yêu cầu sẽ được quản lý xét duyệt.
  - Nếu được duyệt, người dùng đến thư viện để nhận sách.

  **Quy trình trả sách:**
  - Người dùng mang sách đến thư viện và đưa cho quản lý.
  - Quản lý sẽ xác nhận trả sách trên hệ thống.
  - Nếu sách quá hạn, phí phạt sẽ được thu trực tiếp tại quầy.

  **Nguyên tắc trả lời:**
  - Chỉ trả lời dựa trên thông tin và quy định đã được cung cấp ở trên.
  - Không tự ý tạo ra quy định mới hoặc thay đổi chính sách.
  - Nếu người dùng hỏi về thông tin không tồn tại hoặc ngoài phạm vi, hãy lịch sự xin lỗi và đề nghị họ liên hệ quản lý thư viện.
  - Luôn trả lời bằng giọng thân thiện, rõ ràng và lịch sự.
  `;

class AssistantController {
  async generateResponse(req, res, next) {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'error',
            'Yêu cầu không hợp lệ: Thiếu prompt'
          )
        );
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      });

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Response generated successfully',
        data: response.text
      });
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'error',
          'Lỗi không thể tạo phản hồi từ AI'
        )
      );
    }
  }
}

export default new AssistantController();

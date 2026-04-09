# Mô tả kỹ thuật dự án Fintech (Backend - Frontend - Worker)

## Elevator Pitch (dùng ngay cho CV/LinkedIn)
Xây dựng nền tảng fintech full-stack theo kiến trúc tách lớp rõ ràng giữa API, Worker và Web, tập trung vào các bài toán khó của hệ thống tiền tệ: tính chính xác dữ liệu, xử lý giao dịch bất đồng bộ đáng tin cậy, truy vết end-to-end và khả năng mở rộng theo domain.

## Tổng quan kiến trúc
Dự án được tổ chức theo mô hình monorepo với Turborepo và npm workspaces, gồm ba ứng dụng chính:
- apps/api: dịch vụ HTTP sử dụng NestJS, đóng vai trò API boundary cho hệ thống.
- apps/web: ứng dụng Next.js App Router phục vụ giao diện người dùng và admin tools.
- apps/worker: tiến trình nền NestJS Application Context chuyên xử lý tác vụ bất đồng bộ.

Ngoài ra còn có:
- packages/db: package Prisma dùng chung cho schema, migrations và Prisma Client.
- packages/shared: các tiện ích cross-cutting như error handling, observability, context propagation, webhook helpers.

Thiết kế này giúp tách biệt rõ trách nhiệm theo domain và runtime (HTTP runtime, UI runtime, background runtime), giảm coupling, dễ scale độc lập từng thành phần và thuận lợi cho CI/CD trong môi trường production.

Điểm nhấn kiến trúc để nói với HR:
- Không phải CRUD app thông thường, mà là hệ thống có money-flow thật với yêu cầu cao về consistency, auditability và fault tolerance.
- Thiết kế ưu tiên long-term maintainability: tách boundary rõ, giảm lock-in giữa các module, thuận lợi mở rộng thêm domain mới.

## Backend technical (NestJS API)
Backend được xây theo kiến trúc module hóa theo domain nghiệp vụ, gồm các nhóm chức năng như auth, wallets, ledger, transfers, payments, reports, webhook endpoints và admin modules.

Điểm kỹ thuật chính:
- API boundary mỏng (thin controllers): controller chủ yếu nhận request, validate DTO, kiểm tra auth/roles, rồi chuyển vào service. Business logic tập trung ở service layer để dễ test và tái sử dụng.
- Validation nhất quán bằng DTO + ValidationPipe: dữ liệu đầu vào được chuẩn hóa ngay tại biên hệ thống, giảm lỗi nghiệp vụ do payload sai định dạng.
- Error model thống nhất: business errors dùng AppException + ERROR_CODES thay vì throw lỗi rời rạc. Cách này giúp frontend/worker nhận lỗi có cấu trúc, dễ mapping thông điệp và retry policy.
- Traceability xuyên suốt: traceId được giữ xuyên qua API -> queue -> worker để theo dõi luồng giao dịch end-to-end trong observability stack.
- Money boundary discipline: amount ở boundary được giữ dạng string để tránh sai số floating-point; phần domain nội bộ có thể xử lý bằng bigint và chỉ format khi hiển thị UI.
- Prisma + PostgreSQL: schema tập trung trong package dùng chung, đảm bảo API và worker dùng cùng một contract dữ liệu; migration được kiểm soát tập trung để tránh drift giữa môi trường.

Về mặt kiến trúc domain, các tác vụ nhạy cảm như wallet operations, ledger entries, transfer/payment state transitions được triển khai theo hướng explicit flow, ưu tiên tính nhất quán dữ liệu và khả năng audit.

Điểm nhấn backend cho CV (góc nhìn tuyển dụng):
- Giải quyết bài toán reliability ở tầng nghiệp vụ tài chính thay vì chỉ xử lý API endpoints.
- Thiết kế contract lỗi có cấu trúc giúp giảm chi phí vận hành khi tích hợp giữa API - frontend - worker.
- Định hướng "domain-first" giúp codebase dễ bàn giao và onboarding kỹ sư mới.

## Frontend technical (Next.js App Router)
Frontend được tổ chức theo App Router với nguyên tắc tách route/layer rõ ràng:
- src/app: routing và layout.
- src/modules: feature/domain logic (auth, wallets, transfers, payments, admin tools...).
- src/shared: utilities và shared concerns.
- src/providers: global providers cho app shell.

Điểm kỹ thuật chính:
- Không rải fetch ad-hoc trong page files: sử dụng typed API wrappers theo domain để kiểm soát kiểu dữ liệu, handling lỗi và tái sử dụng logic gọi API.
- Đồng bộ domain với backend: cấu trúc module frontend phản chiếu các domain backend, giúp giảm sai lệch contract và tăng tốc bảo trì.
- Quản lý dữ liệu theo luồng nghiệp vụ: UI không format tiền ở tầng dữ liệu nền; chỉ format amount tại bước hiển thị để giữ tính chính xác số học.
- Tập trung trải nghiệm admin và operations: các màn hình phục vụ thao tác nghiệp vụ như theo dõi thanh toán, quản trị ví, webhook/reports được tổ chức theo flow thay vì chỉ theo component rời rạc.

Cách tổ chức này giúp frontend dễ mở rộng chức năng mới, giảm phụ thuộc chéo giữa feature modules và tối ưu khả năng onboarding cho team.

Điểm nhấn frontend cho CV (góc nhìn tuyển dụng):
- Frontend được xây như một "domain client" thay vì UI mỏng, giảm sai lệch nghiệp vụ giữa giao diện và backend.
- Typed API wrappers giúp kiểm soát chất lượng tích hợp và giảm bug kiểu dữ liệu ở các flow nhạy cảm.
- Cấu trúc module rõ ràng hỗ trợ scale team frontend theo feature ownership.

## Worker technical (NestJS background processing)
Worker là một ứng dụng NestJS chạy ở chế độ background context (không mở HTTP server), chuyên xử lý các tác vụ bất đồng bộ và orchestration.

Cách worker hoạt động:
1. API xử lý request đồng bộ và đẩy job vào queue khi gặp tác vụ cần xử lý nền (ví dụ payment processing, webhook delivery, reporting jobs, inbox/outbox).
2. Job payload mang theo metadata quan trọng (đặc biệt là traceId) để duy trì quan sát xuyên suốt.
3. Worker nhận job từ queue qua handler registry pattern:
   - Mỗi loại job được map tới handler tương ứng.
   - Orchestration nằm ở worker layer (retry, scheduling, dispatch).
   - Business logic cốt lõi nằm trong handler/service được inject qua DI.
4. Khi xử lý thất bại, hệ thống áp dụng retry strategy phù hợp theo loại job (ví dụ webhook delivery cần retry theo backoff để đảm bảo eventual delivery).
5. Kết quả xử lý được ghi nhận trạng thái và phát tín hiệu cho các bước tiếp theo trong pipeline (ví dụ cập nhật trạng thái payment, ghi audit, đẩy sự kiện tiếp).

Các nguyên tắc kỹ thuật quan trọng:
- Không tạo Prisma client ad-hoc trong handler; sử dụng provider qua DI để kiểm soát vòng đời kết nối và consistency.
- Tách orchestration khỏi business logic để test độc lập từng lớp và giảm rủi ro regression.
- Ưu tiên idempotent processing cho các luồng tiền tệ và webhook để tránh duplicate side effects khi retry.

Điểm nhấn worker cho CV (góc nhìn tuyển dụng):
- Năng lực xử lý distributed workflow: tách synchronous path (API) và asynchronous path (worker) để tăng độ ổn định hệ thống.
- Thiết kế retry/backoff có chủ đích cho webhook/payment jobs, hướng tới eventual consistency có kiểm soát.
- Tư duy idempotency và trace propagation thể hiện khả năng làm hệ thống production-grade.

## Giá trị kỹ thuật nổi bật để đưa vào CV
- Thiết kế hệ thống fintech theo kiến trúc API + Worker + Web, tách runtime rõ ràng để xử lý đồng bộ và bất đồng bộ hiệu quả.
- Xây dựng domain money flow (wallet/ledger/transfer/payment) theo nguyên tắc chính xác số học và truy vết end-to-end.
- Triển khai worker orchestration với queue/handler registry, retry/backoff, idempotency mindset cho các luồng thanh toán và webhook.
- Chuẩn hóa codebase theo module/domain, shared contracts và typed API communication, giúp hệ thống dễ scale và dễ bảo trì khi team phát triển lớn hơn.

## Phiên bản bullet tối ưu cho HR (ưu tiên tác động)
- Thiết kế và phát triển kiến trúc backend - worker - frontend cho nền tảng fintech, đảm bảo xử lý giao dịch đáng tin cậy ở cả luồng đồng bộ và bất đồng bộ.
- Triển khai domain tài chính cốt lõi (wallet, ledger, transfer, payment, webhook, reports) với nguyên tắc chính xác dữ liệu tiền tệ và khả năng audit.
- Chuẩn hóa nền tảng kỹ thuật gồm DTO validation, structured error model, trace propagation và typed API contracts, giúp giảm lỗi tích hợp liên tầng.
- Xây dựng worker orchestration theo queue/handler registry, áp dụng retry/backoff và idempotent mindset để tăng độ bền vững khi chạy production.

## ATS Keywords (nên xuất hiện trong CV)
NestJS, Next.js App Router, TypeScript, Prisma, PostgreSQL, Monorepo, Turborepo, Queue Processing, Background Jobs, Worker Orchestration, Distributed Systems, Idempotency, Retry/Backoff, Domain-Driven Design, Observability, Traceability, API Contract, RBAC, Webhook Delivery, Financial Systems.

## Mẫu câu có chỗ điền số liệu thật (giúp CV nổi bật hơn)
- Thiết kế hệ thống xử lý [X+] giao dịch/[ngày|tháng] với kiến trúc API + Worker, duy trì luồng xử lý ổn định trong các kịch bản retry và lỗi tạm thời.
- Rút ngắn [X%] thời gian xử lý nghiệp vụ [payment/webhook/report] nhờ tách orchestration khỏi business logic và tối ưu queue handlers.
- Giảm [X%] lỗi tích hợp frontend-backend bằng typed API wrappers, structured error contract và chuẩn hóa validation ở boundary.
- Nâng tỷ lệ xử lý thành công webhook lên [X%] bằng cơ chế retry/backoff + idempotent processing + theo dõi traceId end-to-end.

## Đoạn mô tả ngắn gọn có thể dán vào CV
Phát triển nền tảng fintech full-stack theo monorepo (NestJS API + NestJS Worker + Next.js), xây dựng các domain cốt lõi như auth, wallets, ledger, transfers, payments, webhook và reports. Tập trung vào kiến trúc xử lý giao dịch tin cậy với queue-based background processing, retry/idempotency cho tác vụ bất đồng bộ, chuẩn hóa error/trace observability và đảm bảo tính chính xác dữ liệu tiền tệ ở toàn bộ vòng đời xử lý.

## Đoạn mô tả nâng cấp (HR + Tech Lead đều đọc được)
Đóng vai trò phát triển hệ thống fintech full-stack với kiến trúc tách lớp giữa NestJS API, NestJS Worker và Next.js Web trong môi trường monorepo. Trọng tâm kỹ thuật là các luồng tiền tệ và giao dịch có yêu cầu cao về tính nhất quán dữ liệu, khả năng truy vết và độ tin cậy khi xử lý bất đồng bộ. Triển khai worker orchestration theo queue/handler registry cho payment, webhook và reporting jobs; áp dụng retry/backoff, idempotent processing và trace propagation để đảm bảo hệ thống vận hành ổn định ở production. Đồng thời chuẩn hóa API contracts, DTO validation và structured error handling để giảm lỗi tích hợp liên tầng và tăng tốc độ mở rộng tính năng theo domain.

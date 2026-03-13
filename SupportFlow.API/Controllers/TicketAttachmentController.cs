using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.TicketAttachments;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;


namespace SupportFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/ticketattachments")]
    public class TicketAttachmentController : ControllerBase
    {
        private readonly ITicketAttachmentService _service;
        private readonly IMapper _mapper;

        public TicketAttachmentController(
            ITicketAttachmentService service,
            IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var result = _mapper.Map<IEnumerable<TicketAttachmentResponseDto>>(entities);
            return Ok(result);
        }

        // ✅ THIS METHOD YOU ASKED ABOUT
        // URL → GET api/ticketattachments/21
        [HttpGet("{ticketId}")]
        public async Task<IActionResult> GetByTicketId(int ticketId)
        {
            var data = await _service.GetByTicketId(ticketId);

            // 🔥 IMPORTANT → ALWAYS RETURN OK
            return Ok(data);
        }
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    var entity = await _service.GetByIdAsync(id);
        //    if (entity == null) return NotFound();

        //    return Ok(_mapper.Map<TicketAttachmentResponseDto>(entity));
        //}

        [HttpPost]
        public async Task<IActionResult> Create(TicketAttachmentCreateDto dto)
        {
            var entity = _mapper.Map<TicketAttachment>(dto);
            await _service.CreateAsync(entity);

            return Ok(new { message = "TicketAttachment Created Succesfully" });
           
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TicketAttachmentUpdateDto dto)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return NotFound();

            _mapper.Map(dto, entity);
            await _service.UpdateAsync(entity);

            return Ok(new { message = "TicketAttachmentUpdateDto updated successfully" });

           
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok(new { message = "TicketAttachment deleted" });
        }

        // 🔹 FILE UPLOAD
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] TicketAttachmentUploadDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("File is required");

            // 1️⃣ Folder path
            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "attachments");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // 2️⃣ Unique filename
            var uniqueFileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            // 3️⃣ Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // 4️⃣ Save DB entry
            var attachment = new TicketAttachment
            {
                TicketId = dto.TicketId,
                FileName = dto.File.FileName,
                FilePath = $"attachments/{uniqueFileName}",
                ContentType = dto.File.ContentType
            };

            await _service.CreateAsync(attachment);

            return Ok(new
            {
                message = "File uploaded successfully",
                attachmentId = attachment.Id,
                filePath = attachment.FilePath
            });

        }
        //while creating from create use this 
        //[HttpPost("create-ticket-with-file")]
        //public async Task<IActionResult> CreateTicketWithAttachment([FromForm] TicketAttachmentUploadDto dto)
        //{
        //    // 1️⃣ Save the file (same logic as Upload method)
        //    if (dto.File == null || dto.File.Length == 0)
        //        return BadRequest("File is required");

        //    var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "attachments");
        //    if (!Directory.Exists(uploadFolder))
        //        Directory.CreateDirectory(uploadFolder);

        //    var uniqueFileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
        //    var filePath = Path.Combine(uploadFolder, uniqueFileName);

        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await dto.File.CopyToAsync(stream);
        //    }

        //    // 2️⃣ Create TicketAttachment entity
        //    var attachment = new TicketAttachment
        //    {
        //        TicketId = dto.TicketId,
        //        FileName = dto.File.FileName,
        //        FilePath = $"attachments/{uniqueFileName}",
        //        ContentType = dto.File.ContentType
        //    };

        //    // 3️⃣ Save to DB using service
        //    await _ticketAttachmentService.CreateAsync(attachment);

        //    // 4️⃣ Return success
        //    return Ok("Ticket attachment saved!");
        //}
    }
}
    



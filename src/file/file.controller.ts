import {
  Controller,
  Get,
  Put,
  UseInterceptors,
  Param,
  Res,
  Body,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FilledPDF } from "./file.entity"
import { Response } from "express"
import * as fs from "fs"
import { writeFile } from "fs/promises"
import * as path from "path"
import * as AWS from "aws-sdk" // Import AWS SDK

@Controller("files")
export class FileController {
  constructor(
    @InjectRepository(FilledPDF)
    private readonly filledPDFRepository: Repository<FilledPDF>
  ) {}

  @Get(":filename")
  async getFile(@Param("filename") filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, "../..", "files", filename)
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found")
    }

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
    fs.createReadStream(filePath).pipe(res)
  }

  @Put(":filename")
  @UseInterceptors(FileInterceptor("pdf"))
  async saveFile(@Body() requestBody: { pdfData: number[] }) {
    const uint8Array = new Uint8Array(requestBody.pdfData)

    try {
      const s3 = new AWS.S3() // Create S3 instance

      // Upload the PDF file to S3
      const bucketName = "nestjs-bhumfile-bucket"
      const key = "example.pdf"
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: Buffer.from(uint8Array),
          ContentType: "application/pdf",
          ContentDisposition: "attachment; filename=example.pdf",
        })
        .promise()

      // Save the file details to the database
      const link = `https://${bucketName}.s3.amazonaws.com/${key}`
      const filledPDF = new FilledPDF()
      filledPDF.filename = "example.pdf"
      filledPDF.link = link
      filledPDF.pdfData = requestBody.pdfData
      await this.filledPDFRepository.save(filledPDF)

      return "PDF saved successfully"
    } catch (error) {
      throw new Error("Failed to save file")
    }
  }
}

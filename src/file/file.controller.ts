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
import { S3 } from "aws-sdk"

@Controller("files")
export class FileController {
  constructor(
    @InjectRepository(FilledPDF)
    private readonly filledPDFRepository: Repository<FilledPDF>
  ) {}

  @Get(":filename")
  async getFile(@Param("filename") filename: string, @Res() res: Response) {
    const s3 = new S3()
    const bucketName = "nestjs-bhumfile-bucket"

    const params = {
      Bucket: bucketName,
      Key: filename,
    }

    try {
      const fileStream = s3.getObject(params).createReadStream()
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
      fileStream.pipe(res)
    } catch (error) {
      console.error("Error fetching file from AWS S3:", error)
      return res.status(404).send("File not found")
    }
  }

  @Put(":filename")
  @UseInterceptors(FileInterceptor("pdf"))
  async saveFile(@Body() requestBody: { pdfData: number[] }) {
    const uint8Array = new Uint8Array(requestBody.pdfData) // Convert array back to Uint8Array
    try {
      const filePath = `files/example.pdf`

      await writeFile(filePath, uint8Array) // Save the Uint8Array to the file path

      const pdfData = requestBody.pdfData

      const link = `/files/example.pdf`
      const filledPDF = new FilledPDF()
      filledPDF.filename = "example.pdf"
      filledPDF.link = link
      filledPDF.pdfData = pdfData
      await this.filledPDFRepository.save(filledPDF)

      return "PDF saved successfully"
    } catch (error) {
      throw new Error("Failed to save file")
    }
  }
}

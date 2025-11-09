-- Migration: Add tipo_archivo column to solicitudes_apertura table
-- This column will store the file extension/type for downloaded files

USE banca_uno;

-- Add tipo_archivo column to store file extension
ALTER TABLE solicitudes_apertura 
ADD COLUMN tipo_archivo VARCHAR(10) NULL 
AFTER archivo;

-- Add comment to explain the column
ALTER TABLE solicitudes_apertura 
MODIFY COLUMN tipo_archivo VARCHAR(10) NULL 
COMMENT 'File extension: pdf, png, jpg, jpeg, doc, docx';

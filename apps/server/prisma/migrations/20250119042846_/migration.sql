-- AddForeignKey
ALTER TABLE "ExplorerItems" ADD CONSTRAINT "ExplorerItems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

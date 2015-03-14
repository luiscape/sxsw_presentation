library(reshape2)
library(RJSONIO)

d = read.csv('refugees.csv')
d$date <- as.Date(d$updated_at)
y <- d[!duplicated(d$date),]
x = dcast(y, name + date ~ module_name, value.var = "value")

y <- data.frame("Registered Syrian Refugees" = x$"Registered Syrian Refugees",
                date = x$date)



y$date <- as.character(x$date)
write.csv(y, "refugees_wide.csv", row.names = F)

sink("syrian_refugees.json")
cat(toJSON(na.omit(y)))
sink()

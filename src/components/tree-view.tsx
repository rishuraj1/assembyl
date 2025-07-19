import { TreeItem } from "@/types";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail } from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";


interface TreeViewProps {
    data: TreeItem[];
    value?: string | null;
    onSelect?: (filePath: string) => void;
}

export const TreeView = ({
    data,
    value,
    onSelect
}: TreeViewProps) => {
    return (
        <SidebarProvider>
            <Sidebar collapsible="none" className="w-full">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item, index) => (
                                    <Tree
                                        key={index}
                                        item={item}
                                        parentPath=""
                                        onSelect={onSelect}
                                        selectedValue={value}
                                    /> 
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        </SidebarProvider>
    )
}


interface TreeProps {
    item: TreeItem;
    selectedValue?: string | null;
    onSelect?: (filePath: string) => void;
    parentPath: string;
}

const Tree = ({
    item,
    parentPath,
    onSelect,
    selectedValue
}: TreeProps) => {
    if (typeof item === "string") {
        console.log("File:", item, "Parent Path:", parentPath);
        // It's a file
        const currentPath = parentPath ? `${parentPath}/${item}` : item;
        const isSelected = selectedValue === currentPath;
        return (
            <SidebarMenuButton
                isActive={isSelected}
                className="data-[active=true]:bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => onSelect?.(currentPath)}
            >
                <FileIcon className="w-4 h-4" />
                <span className="truncate">
                    {item}
                </span>
            </SidebarMenuButton>
        );
    }

    if (Array.isArray(item)) {
        const [name, ...children] = item;
        const currentPath = parentPath ? `${parentPath}/${name}` : name;
        return (
            <SidebarMenuItem>
                <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" defaultOpen>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ChevronRightIcon className="w-4 h-4 transition-transform" />
                            <FolderIcon className="w-4 h-4" />
                            <span className="truncate">
                                {name}
                            </span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {children.map((subItem, index) => (
                                <Tree
                                    key={index}
                                    item={subItem}
                                    parentPath={currentPath}
                                    onSelect={onSelect}
                                    selectedValue={selectedValue}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        );
    }
    // fallback (should not happen)
    return null;
}